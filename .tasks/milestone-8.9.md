# Milestone 8.9: AI Matching v2 - Cross-Encoder Re-Ranking Pipeline

## Overview

Add a Cross-Encoder re-ranking stage to the job matching pipeline. Currently, matching uses a bi-encoder (cosine similarity on embeddings) which compresses entire profiles into single vectors, causing "pooling loss". A cross-encoder takes profile+job as a pair and outputs a precise relevance score, significantly improving ranking accuracy.

**Architecture: Two-Stage Retrieval**
1. **Stage 1 (existing)**: SQL function `match_jobs_for_user()` applies hard filters (experience level, workplace type, skill matches) + cosine similarity → returns top 50 candidates
2. **Stage 2 (new)**: Cross-encoder re-ranks top candidates with pairwise relevance scoring → selects top 20 final matches

## Scope

### In Scope (4 sub-tasks)
- **8.9.1**: Add cross-encoder support to `@codeforge-v2/embeddings` package
- **8.9.2**: Create re-ranking logic with `ReRanker` interface
- **8.9.3**: Update `matchJobs` server action with 2-stage pipeline
- **8.9.4**: Improve text representation for cross-encoder input

### Out of Scope
- **8.9.5**: Technology normalization aliases (current `normalize_skill()` SQL function is sufficient)
- **8.9.6**: User feedback UI (removed from plan entirely)

## Key Decisions (Already Approved)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Re-rank count | Top 20 candidates | Balance of speed (~3-8s) and coverage |
| Score storage | Replace `similarity_score` | No new column; dashboard automatically uses the better score |
| Tech aliases | Skip | Current `normalize_skill()` handles variants adequately |
| Feedback UI | Removed | No immediate matching improvement without processing pipeline |

---

## Architecture Design

### New Interface: `ReRanker` (separate from `EmbeddingProvider`)

Cross-encoders have a fundamentally different API from bi-encoders:
- Bi-encoder: `text → number[]` (vector)
- Cross-encoder: `(query, document) → number` (relevance score)

Forcing them into the same `EmbeddingProvider` interface would be awkward. Instead, create a parallel `ReRanker` interface in the same package, sharing infrastructure (errors, validation, constants, factory pattern).

### Data Flow

```
User clicks "Match Jobs"
  ↓
matchJobs() server action
  ├─ 1. Auth check
  ├─ 2. Fetch profile (embedding, skills, experience_level, preferred_locations, ideal_role_description)
  ├─ 3. SQL RPC match_jobs_for_user() → Top 50 candidates (hard filters + cosine similarity)
  ├─ 4. Fetch full offer details for candidates (title, company, techs, salary, etc.)
  ├─ 5. Format profile as cross-encoder query text
  ├─ 6. Format each job as cross-encoder document text
  ├─ 7. reranker.rankPairs(profileQuery, jobDocuments) → sorted by relevance
  ├─ 8. Take top 20 re-ranked results
  ├─ 9. Normalize scores to 0-1 range (sigmoid)
  ├─ 10. Deduplicate against existing user_offers
  └─ 11. Insert with cross-encoder scores as similarity_score
```

---

## Implementation Steps

### Step 1: Add ReRanker Types

**File to modify**: `packages/embeddings/src/types.ts`

Add these types alongside existing `EmbeddingProvider`:

```typescript
export interface RankedDocument {
  index: number;
  score: number;
}

export interface ReRanker {
  rankPairs(query: string, documents: string[]): Promise<RankedDocument[]>;
  getName(): string;
}
```

- `index` refers to the position in the input `documents` array
- `score` is the cross-encoder relevance score (raw logit or sigmoid-normalized)
- Results should be returned sorted by score descending (best match first)

### Step 2: Add ReRanker Constants

**File to modify**: `packages/embeddings/src/constants.ts`

Add after existing constants:

```typescript
export const RERANKER_MODEL_IDS = {
  local: "Xenova/ms-marco-MiniLM-L-6-v2",
} as const;
```

This model is a cross-encoder trained on MS MARCO (Bing search data), excellent for query-document relevance scoring. ~23MB download, cached at `~/.cache/huggingface/`.

### Step 3: Add RerankingError

**File to modify**: `packages/embeddings/src/errors.ts`

Add a new error class following the existing pattern:

```typescript
export class RerankingError extends EmbeddingError {
  constructor(provider: string, cause?: unknown) {
    super(
      `Failed to rerank documents: ${provider}`,
      "RERANKING_FAILED",
      provider,
      cause
    );
    this.name = "RerankingError";
  }
}
```

Also add `RERANKING_FAILED` to the `ERROR_CODES` constant.

### Step 4: Implement Local ReRanker Provider

**File to create**: `packages/embeddings/src/providers/local-reranker.ts`

This is the core implementation. Follow the EXACT same patterns as `local.ts`:

**Model loading pattern** (copy from `local.ts`):
- Module-level `modelInstance` and `modelPromise` variables
- `initializeModel()` async function
- `loadModel()` with concurrent request deduplication (if model loading, await same promise)
- Reset `modelPromise = null` on failure to allow retry

**Key difference from bi-encoder**: Use `pipeline("text-classification", MODEL_ID)` instead of `pipeline("feature-extraction", MODEL_ID)`.

The `text-classification` pipeline for MS MARCO cross-encoder:
- Input: `{ text: query, text_pair: document }` (or pass as positional args)
- Output: `[{ label: "LABEL_0", score: 0.123 }]` — the score is a sigmoid-transformed relevance score (0-1)

**Implementation approach for `rankPairs`**:
1. Validate query and all documents using existing `validateInput()`
2. Return empty array if documents is empty
3. Load model (lazy, cached)
4. Process each (query, document) pair through the pipeline
5. Collect scores, map to `RankedDocument[]` with original indices
6. Sort by score descending
7. Wrap errors in `RerankingError`

**IMPORTANT**: The `@xenova/transformers` `text-classification` pipeline accepts one input at a time. For batch processing, loop through documents:

```typescript
const results: RankedDocument[] = [];
for (let i = 0; i < documents.length; i++) {
  const output = await model(query, { text_pair: documents[i], top_k: 1 });
  results.push({ index: i, score: output[0].score });
}
return results.sort((a, b) => b.score - a.score);
```

**Note on score normalization**: The MS MARCO model outputs scores via sigmoid, so they're already in 0-1 range. No additional normalization needed. These scores can be stored directly in `user_offers.similarity_score`.

### Step 5: Create ReRanker Factory

**File to create**: `packages/embeddings/src/reranker-factory.ts`

Follow the exact pattern of `factory.ts`:
- `Map<string, ReRanker>` cache
- `createReRanker(provider?: string)` function
- `getDefaultReRanker()` function
- Default provider: `"local"`
- Only one provider for now (local), but the switch/case structure allows future extension

### Step 6: Create Text Formatting Utilities

**File to create**: `packages/embeddings/src/text-formatting.ts`

Two formatting functions optimized for the cross-encoder model:

**`formatProfileQuery(data)`**:
```
Input: { skills: string[], experienceLevels: string[], workLocations: string[], idealRoleDescription: string }
Output: "Skills: React, TypeScript, Node.js | Experience: mid, senior | Work location: remote, hybrid | Looking for a full-stack role..."
```

**`formatJobDocument(data)`**:
```
Input: { title, companyName?, experienceLevel?, workplaceType?, city?, technologies: string[], salaryFrom?, salaryTo?, salaryCurrency? }
Output: "Senior Full Stack Developer | Company: Acme Corp | Level: senior | Type: remote | Location: Warsaw | Tech: React, Node.js | Salary: 15000-20000 PLN"
```

**Design rationale**:
- Labeled fields (`Skills:`, `Level:`, `Type:`) help the cross-encoder understand field semantics
- Pipe-delimited format is consistent with existing embedding text patterns
- Include all available fields for maximum signal — cross-encoder handles relevance weighting
- Filter out null/empty fields to avoid noise

**Type definitions**: Define `ProfileQueryData` and `JobDocumentData` interfaces in this same file. These are simple input types only used by the formatting functions — inline them here per the co-location convention (single-use types → inline).

### Step 7: Update Package Exports

**File to modify**: `packages/embeddings/src/index.ts`

Add these exports:

```typescript
// Re-ranker
export { createReRanker } from "./reranker-factory";
export type { ReRanker, RankedDocument } from "./types";
import { getDefaultReRanker } from "./reranker-factory";
export const reranker = getDefaultReRanker();

// Text formatting
export {
  formatProfileQuery,
  formatJobDocument,
} from "./text-formatting";
export type { ProfileQueryData, JobDocumentData } from "./text-formatting";

// Errors (add RerankingError)
export { EmbeddingError, RerankingError } from "./errors";
```

### Step 8: Update matchJobs Server Action

**File to modify**: `apps/web/src/features/dashboard/api/match-jobs.ts`

This is the main integration point. The current flow:
1. Auth check
2. Fetch profile (embedding, experience_level, preferred_locations, skills)
3. Call SQL RPC → matches
4. Deduplicate
5. Insert

**Changes needed**:

**8a. Update profile fetch** (line 27-31): Add `ideal_role_description` to the select:
```typescript
.select("embedding, experience_level, preferred_locations, skills, ideal_role_description")
```

**8b. After SQL RPC returns matches** (after line 62): Add re-ranking stage:

1. Extract offer IDs from matches
2. Fetch full offer details from `offers` table with `offer_technologies(technologies(name))`
3. Build profile query using `formatProfileQuery()`
4. Build job documents array using `formatJobDocument()` for each offer
5. Call `reranker.rankPairs(profileQuery, jobDocuments)`
6. Take top 20 results
7. Map re-ranked results back to offer IDs with new scores
8. Continue with existing deduplication logic using re-ranked data

**8c. Error handling for re-ranking**:
```typescript
try {
  const ranked = await reranker.rankPairs(profileQuery, jobDocuments);
  // ... process results
} catch (_error) {
  return err("Failed to re-rank job matches. Please try again.");
}
```

**8d. Score replacement**: When building `userOffers` array for insertion, use the cross-encoder score instead of `match.similarity`:
```typescript
const userOffers = rerankedMatches.map((match) => ({
  user_id: user.id,
  offer_id: match.offerId,
  status: "saved",
  similarity_score: match.score,  // cross-encoder score (0-1)
}));
```

**8e. Reduce MATCH_COUNT constant**: Consider reducing from 50 to 50 (keep as-is for Stage 1 retrieval breadth), but only re-rank and insert top 20. Add a new constant:
```typescript
const RERANK_COUNT = 20;
```

### Step 9: Build and Validate

Run the full validation suite:
```bash
pnpm run build          # Production build all packages
pnpm run check-types    # TypeScript validation
pnpm run lint           # Biome linting
pnpm run knip           # Unused exports/deps check
```

---

## Files Summary

### Files to Create (3)
| File | Purpose |
|------|---------|
| `packages/embeddings/src/providers/local-reranker.ts` | Cross-encoder model loading + `rankPairs()` implementation |
| `packages/embeddings/src/reranker-factory.ts` | Factory with singleton caching for reranker providers |
| `packages/embeddings/src/text-formatting.ts` | `formatProfileQuery()` + `formatJobDocument()` utilities |

### Files to Modify (5)
| File | Changes |
|------|---------|
| `packages/embeddings/src/types.ts` | Add `ReRanker` interface, `RankedDocument` type |
| `packages/embeddings/src/constants.ts` | Add `RERANKER_MODEL_IDS` |
| `packages/embeddings/src/errors.ts` | Add `RERANKING_FAILED` error code, `RerankingError` class |
| `packages/embeddings/src/index.ts` | Export reranker singleton, factory, types, text formatting |
| `apps/web/src/features/dashboard/api/match-jobs.ts` | Integrate 2-stage pipeline with re-ranking |

### Files NOT to Modify
- No database migration needed (reuses `similarity_score` column)
- No dashboard UI changes (existing `MatchScoreRing` works with 0-1 scores)
- No scraper changes (bi-encoder embeddings for Stage 1 remain unchanged)

---

## Critical Implementation Details

### Cross-Encoder vs Bi-Encoder

| Aspect | Bi-Encoder (existing) | Cross-Encoder (new) |
|--------|----------------------|---------------------|
| Model | `Xenova/all-MiniLM-L6-v2` | `Xenova/ms-marco-MiniLM-L-6-v2` |
| Pipeline | `feature-extraction` | `text-classification` |
| Input | Single text → vector | (query, document) pair |
| Output | `number[]` (384 dims) | `number` (relevance score 0-1) |
| Speed | ~100-500ms per text | ~100-300ms per pair |
| Usage | Stage 1: fast retrieval | Stage 2: precise re-ranking |

### Score Behavior

The MS MARCO cross-encoder outputs sigmoid-normalized scores (0-1). However, the score distribution is different from cosine similarity:
- **Cosine similarity** (current): scores typically 0.3-0.7 for relevant matches
- **Cross-encoder scores**: scores typically 0.0-1.0 with clearer separation between relevant/irrelevant

The existing `calculateMatchPercentage()` in `job-display.ts` does `Math.round(score * 100)`, which works for both score types. The `MatchScoreRing` color coding (excellent >=80, good >=60, fair >=40, poor <40) will still function correctly.

### Performance Budget

- SQL Stage 1: ~100-500ms (existing, unchanged)
- Fetch offer details: ~100-200ms (new DB query)
- Cross-encoder model load (first call): ~2-5s (cached after)
- Re-ranking 20 documents: ~2-6s (sequential pair processing)
- Total first-call latency: ~5-12s
- Total warm latency: ~3-8s
- **Target**: <5s for warm calls (20 documents)

### Memory Requirements

Both models loaded simultaneously:
- Bi-encoder (all-MiniLM-L6-v2): ~100-200MB
- Cross-encoder (ms-marco-MiniLM-L-6-v2): ~50-100MB
- Total: ~150-300MB per process
- Ensure 512MB+ available

### Existing Code Patterns to Follow

1. **Provider creation**: `createLocalReRanker()` returns `ReRanker` object (functional, not class-based — matches `createLocalProvider()` pattern)
2. **Lazy loading**: Module-level `let modelInstance = null` + `let modelPromise = null` with `loadModel()` deduplication
3. **Error wrapping**: Catch transformers.js errors, wrap in custom error classes
4. **Validation**: Use existing `validateInput()` from `validation.ts`
5. **Biome/lint**: No console.log, no comments, prefer unknown over any (except `PipelineType` which is `any` with biome-ignore)
6. **Exports**: Named exports, type-only imports with `import type`

### matchJobs Integration: Offer Details Query

To re-rank, we need full offer details (not just IDs from SQL RPC). Fetch from offers table:

```typescript
const { data: offers } = await supabase
  .from("offers")
  .select(`
    id, title, company_name, experience_level, workplace_type, city,
    salary_from, salary_to, salary_currency,
    offer_technologies (
      technologies (name)
    )
  `)
  .in("id", offerIds);
```

Then build a `Map<offerId, offerData>` for efficient lookup when constructing job documents.

### matchJobs: Preserving Offer Order

After re-ranking, the results are sorted by cross-encoder score. Map back to offer IDs:

```typescript
const reranked = await reranker.rankPairs(profileQuery, jobDocuments);
const top20 = reranked.slice(0, RERANK_COUNT);

const rerankedMatches = top20.map((r) => ({
  offer_id: offersArray[r.index].id,
  similarity: r.score,
}));
```

Then proceed with existing deduplication logic using `rerankedMatches` instead of `matches`.

---

## Validation Checklist

After implementation, verify:

- [ ] `pnpm run build` passes (all packages)
- [ ] `pnpm run check-types` passes
- [ ] `pnpm run lint` passes
- [ ] `pnpm run knip` passes (no unused exports)
- [ ] `reranker` singleton is exported from `@codeforge-v2/embeddings`
- [ ] `formatProfileQuery` and `formatJobDocument` are exported
- [ ] `RerankingError` is exported from errors
- [ ] `matchJobs()` fetches `ideal_role_description` from profile
- [ ] `matchJobs()` calls reranker after SQL RPC
- [ ] `matchJobs()` limits to top 20 re-ranked results
- [ ] Cross-encoder scores stored in `similarity_score` column (no schema change)
- [ ] Error handling: re-ranking failure returns `err()` to user

---

## Post-Implementation

### Quality Review

After implementation is complete, run the `/feature-dev:code-review` skill to review:
1. **Simplicity/DRY/Elegance** — Check for code duplication, unnecessary abstractions
2. **Bugs/Functional Correctness** — Verify score normalization, index mapping, error paths
3. **Project Conventions** — Ensure co-location patterns, naming, imports follow CLAUDE.md

### Update tasks.md

After all validation passes, update the following in `/Users/kubunito/Prywatne/codeforge-v2/tasks.md`:
1. Mark tasks 8.9.1, 8.9.2, 8.9.3, 8.9.4 as `[x]` complete
2. Mark 8.9.5 as skipped (note: current normalization sufficient)
3. Mark 8.9.6 as removed from plan
4. Add "What was built" summary section under Milestone 8.9
5. Update the Summary table to show M8.9 as "✅ Complete"
6. Update M8.10 row to show "← NEXT"

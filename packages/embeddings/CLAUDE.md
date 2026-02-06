# Embeddings Package - CLAUDE.md

Local semantic embedding generation and cross-encoder re-ranking using transformers.js for AI-powered job matching.

## Commands

```bash
pnpm build        # Compile TypeScript to dist/
pnpm check-types  # TypeScript validation
```

## Package Structure

```
src/
├── index.ts              # Public API: embeddings + reranker singletons, factories, errors, text formatting
├── factory.ts            # Embedding provider factory with singleton caching
├── reranker-factory.ts   # ReRanker factory with singleton caching
├── text-formatting.ts    # formatProfileQuery() + formatJobDocument() for cross-encoder input
├── types.ts              # EmbeddingProvider, ReRanker, RankedDocument interfaces
├── constants.ts          # Provider names, model IDs, dimensions, input limits, reranker model IDs
├── errors.ts             # Custom error hierarchy (EmbeddingError base, RerankingError)
├── validation.ts         # Zod schemas for input text and config
└── providers/
    ├── local.ts          # Bi-encoder: Xenova/all-MiniLM-L6-v2 (384 dims, feature-extraction)
    ├── local-reranker.ts # Cross-encoder: Xenova/ms-marco-MiniLM-L-6-v2 (text-classification)
    └── openai.ts         # Placeholder (throws ProviderNotImplementedError)
```

## Public API

```typescript
// Bi-encoder (embeddings)
import { embeddings, EmbeddingError, createEmbeddingProvider } from "@codeforge-v2/embeddings";
import type { EmbeddingProvider } from "@codeforge-v2/embeddings";

const vector = await embeddings.generateEmbedding("text");  // number[] (384 dims)
embeddings.getDimensions();  // 384
embeddings.getName();        // "local (Xenova/all-MiniLM-L6-v2)"

// Cross-encoder (reranker)
import { reranker, RerankingError, createReRanker } from "@codeforge-v2/embeddings";
import type { ReRanker, RankedDocument } from "@codeforge-v2/embeddings";

const ranked = await reranker.rankPairs("query text", ["doc1", "doc2"]);
// Returns RankedDocument[] sorted by score desc: [{ index: 1, score: 0.95 }, { index: 0, score: 0.32 }]
reranker.getName();  // "local-reranker (Xenova/ms-marco-MiniLM-L-6-v2)"

// Text formatting (for cross-encoder input)
import { formatProfileQuery, formatJobDocument } from "@codeforge-v2/embeddings";
import type { ProfileQueryData, JobDocumentData } from "@codeforge-v2/embeddings";

const query = formatProfileQuery({ skills, experienceLevels, workLocations, idealRoleDescription });
// "Skills: React, TypeScript | Experience: mid, senior | Work location: remote | Looking for..."
const doc = formatJobDocument({ title, companyName, experienceLevel, workplaceType, city, technologies, salaryFrom, salaryTo, salaryCurrency });
// "Senior Developer | Company: Acme | Level: senior | Type: remote | Tech: React, Node.js | Salary: 15000-20000 PLN"
```

## Architecture

### Two-Stage Retrieval Pipeline

Job matching uses a two-stage approach:
1. **Stage 1 - Bi-Encoder (fast retrieval)**: `embeddings.generateEmbedding()` creates vectors for cosine similarity search via SQL. Returns top 50 candidates.
2. **Stage 2 - Cross-Encoder (precise re-ranking)**: `reranker.rankPairs()` scores each (profile, job) pair. Returns top 20 re-ranked results.

### Bi-Encoder (`EmbeddingProvider`)

**Provider Pattern**: `EmbeddingProvider` interface with pluggable implementations.
- `LocalProvider` (active): Xenova/all-MiniLM-L6-v2, 384 dimensions, `feature-extraction` pipeline
- `OpenAIProvider` (placeholder): text-embedding-ada-002, 1536 dimensions, not implemented

**Factory**: `createEmbeddingProvider(config?)` returns cached instances. Default via `EMBEDDING_PROVIDER` env var (defaults to `"local"`).

### Cross-Encoder (`ReRanker`)

**Provider Pattern**: `ReRanker` interface (separate from `EmbeddingProvider` — different API shape).
- `LocalReRanker` (active): Xenova/ms-marco-MiniLM-L-6-v2, `text-classification` pipeline
- Input: `(query, document)` pair → Output: relevance score (0-1, sigmoid-normalized)

**Factory**: `createReRanker(provider?)` returns cached instances. Default: `"local"`.

**Key differences from bi-encoder**:
- Bi-encoder: `text → number[]` (vector for similarity search)
- Cross-encoder: `(query, document) → number` (pairwise relevance score)
- Cross-encoder is ~10x slower but significantly more accurate for ranking

### Text Formatting

`formatProfileQuery()` and `formatJobDocument()` produce labeled pipe-delimited strings optimized for the cross-encoder:
- Labels (`Skills:`, `Level:`, `Type:`) help the model understand field semantics
- Null/empty fields are filtered out to avoid noise
- Types (`ProfileQueryData`, `JobDocumentData`) are inlined in `text-formatting.ts`

### Shared Infrastructure

**Lazy model loading**: Both models use the same pattern — module-level `modelInstance` + `modelPromise` with concurrent request deduplication. First call downloads model to `~/.cache/huggingface/`.

**Validation**: Both providers use `validateInput()` from `validation.ts` (1-10,000 chars).

## Consumers

### Web App - Onboarding & Profile Update (bi-encoder)

```typescript
// @apps/web/src/features/onboarding/api/complete-onboarding.ts
// @apps/web/src/features/profile/api/update-profile.ts
const profileText = `Skills: ${data.skills.join(", ")} | Experience levels: ${experienceLevels} | Work locations: ${workLocations} | ${data.idealRoleDescription}`;

let embedding: number[] | null = null;
try {
  embedding = await embeddings.generateEmbedding(profileText);
} catch (_error) {
  return err("Failed to generate profile embedding. Please try again.");
}
```

### Web App - Job Matching (cross-encoder)

```typescript
// @apps/web/src/features/dashboard/api/match-jobs.ts
// Two-stage pipeline:
// 1. SQL RPC match_jobs_for_user() → top 50 candidates (hard filters + cosine similarity)
// 2. reranker.rankPairs(profileQuery, jobDocuments) → top 20 re-ranked results
// Cross-encoder scores stored in user_offers.similarity_score (replaces cosine score)
```

### Scraper - Offer Embeddings (bi-encoder)

```typescript
// @packages/scraper/src/services/scraping.service.ts
const embeddingText = [offer.title, offer.experience_level, techNames, offer.city]
  .filter(Boolean)
  .join(" | ");
const embedding = await embeddings.generateEmbedding(embeddingText);
```

## Error Handling

Custom error hierarchy with error codes:

| Error Class | Code | When |
|---|---|---|
| `ModelLoadError` | `MODEL_LOAD_FAILED` | Model download/init failure (bi-encoder or cross-encoder) |
| `ValidationError` | `VALIDATION_FAILED` | Empty string or >10,000 chars |
| `EmbeddingError` | `GENERATION_FAILED` | Embedding generation failure |
| `RerankingError` | `RERANKING_FAILED` | Cross-encoder re-ranking failure |
| `ProviderNotImplementedError` | `PROVIDER_NOT_IMPLEMENTED` | Using OpenAI provider |
| `InvalidDimensionsError` | `INVALID_DIMENSIONS` | Wrong vector size returned |

All consumers use non-blocking pattern: catch errors and either return `err()` or skip silently.

## Performance

### Bi-Encoder (embeddings)
- **First call**: 2-5s (model download + init, ~90MB cached at `~/.cache/huggingface/`)
- **Subsequent calls**: 100-500ms per embedding
- **Memory**: ~100-200MB per process

### Cross-Encoder (reranker)
- **First call**: 2-5s (model download + init, ~23MB cached at `~/.cache/huggingface/`)
- **Re-ranking 20 documents**: ~2-6s (sequential pair processing)
- **Memory**: ~50-100MB per process

### Combined (both models loaded)
- **Total memory**: ~150-300MB (need 512MB+ available)
- **Warm matching latency**: ~3-8s (SQL + fetch + re-rank)

## Database Integration

Embeddings stored as `VECTOR(384)` columns (pgvector) on `profiles` and `offers` tables. The `match_jobs_for_user()` RPC performs hybrid filtering + cosine similarity search. Cross-encoder scores replace cosine scores in `user_offers.similarity_score`. See @packages/database/CLAUDE.md for full schema.

## Environment Variables

```bash
EMBEDDING_PROVIDER=local  # Optional, defaults to "local". "openai" not implemented.
```

## Dependencies

- `@xenova/transformers` - Local ML model inference (WASM) for both bi-encoder and cross-encoder
- `zod` - Input/config validation

## Gotchas

1. **First call is slow** - each model downloads on first use. Pre-warm during app init if needed
2. **Model caching** - stored in `~/.cache/huggingface/`. In Docker, mount this directory
3. **Input limits** - 1-10,000 characters, validated via Zod. Empty strings throw `ValidationError`
4. **Provider caching** - both factories cache providers by config. Same config returns same instance
5. **Two models loaded** - bi-encoder + cross-encoder both stay in memory after first use (~150-300MB total)
6. **Cross-encoder is sequential** - each (query, document) pair processed one at a time; 20 pairs ≈ 2-6s

# Embeddings Package - CLAUDE.md

Local semantic embedding generation using transformers.js for AI-powered job matching.

## Commands

```bash
pnpm build        # Compile TypeScript to dist/
pnpm check-types  # TypeScript validation
```

## Package Structure

```
src/
├── index.ts              # Public API: embeddings singleton, createEmbeddingProvider, EmbeddingError
├── factory.ts            # Provider factory with singleton caching
├── types.ts              # EmbeddingProvider interface, EmbeddingConfig
├── constants.ts          # Provider names, model IDs, dimensions, input limits
├── errors.ts             # Custom error hierarchy (EmbeddingError base)
├── validation.ts         # Zod schemas for input text and config
└── providers/
    ├── local.ts          # Xenova/all-MiniLM-L6-v2 implementation (384 dims)
    └── openai.ts         # Placeholder (throws ProviderNotImplementedError)
```

## Public API

```typescript
import { embeddings, EmbeddingError, createEmbeddingProvider } from "@codeforge-v2/embeddings";
import type { EmbeddingProvider } from "@codeforge-v2/embeddings";

const vector = await embeddings.generateEmbedding("text");  // number[] (384 dims)
embeddings.getDimensions();  // 384
embeddings.getName();        // "local (Xenova/all-MiniLM-L6-v2)"
```

## Architecture

**Provider Pattern**: `EmbeddingProvider` interface with pluggable implementations.
- `LocalProvider` (active): Xenova/all-MiniLM-L6-v2, 384 dimensions, CPU/WASM
- `OpenAIProvider` (placeholder): text-embedding-ada-002, 1536 dimensions, not implemented

**Factory Pattern**: `createEmbeddingProvider(config?)` returns cached instances. Default provider selected via `EMBEDDING_PROVIDER` env var (defaults to `"local"`).

**Lazy model loading**: First call downloads model (~90MB to `~/.cache/huggingface/`). Concurrent calls await same promise (no duplicate downloads).

## Consumers

### Web App - Onboarding & Profile Update

```typescript
// apps/web/src/features/onboarding/api/complete-onboarding.ts
// apps/web/src/features/profile/api/update-profile.ts
const profileText = `Skills: ${data.skills.join(", ")} | Experience levels: ${experienceLevels} | Work locations: ${workLocations} | ${data.idealRoleDescription}`;

let embedding: number[] | null = null;
try {
  embedding = await embeddings.generateEmbedding(profileText);
} catch (_error) {
  return err("Failed to generate profile embedding. Please try again.");
}

// Stored as JSON.stringify(embedding) in profiles table
```

### Scraper - Offer Embeddings

```typescript
// packages/scraper/src/services/scraping.service.ts
const embeddingText = [offer.title, offer.experience_level, techNames, offer.city]
  .filter(Boolean)
  .join(" | ");
const embedding = await embeddings.generateEmbedding(embeddingText);
// Stored directly on offer object, failed embeddings skipped silently
```

## Error Handling

Custom error hierarchy with error codes:

| Error Class | Code | When |
|---|---|---|
| `ModelLoadError` | `MODEL_LOAD_FAILED` | Model download/init failure |
| `ValidationError` | `VALIDATION_FAILED` | Empty string or >10,000 chars |
| `EmbeddingError` | `GENERATION_FAILED` | Embedding generation failure |
| `ProviderNotImplementedError` | `PROVIDER_NOT_IMPLEMENTED` | Using OpenAI provider |
| `InvalidDimensionsError` | `INVALID_DIMENSIONS` | Wrong vector size returned |

All consumers use non-blocking pattern: catch errors and either return `err()` or skip silently.

## Performance

- **First call**: 2-5s (model download + init, ~90MB cached at `~/.cache/huggingface/`)
- **Subsequent calls**: 100-500ms per embedding
- **Memory**: ~100-200MB per process for loaded model (need 512MB+ available)

## Database Integration

Embeddings stored as `VECTOR(384)` columns (pgvector) on `profiles` and `offers` tables. The `match_jobs_for_user()` RPC performs cosine similarity search. See `packages/database/CLAUDE.md` for full schema.

## Environment Variables

```bash
EMBEDDING_PROVIDER=local  # Optional, defaults to "local". "openai" not implemented.
```

## Dependencies

- `@xenova/transformers` - Local ML model inference (WASM)
- `zod` - Input/config validation

## Gotchas

1. **First call is slow** - model downloads on first use. Pre-warm during app init if needed
2. **Model caching** - stored in `~/.cache/huggingface/`. In Docker, mount this directory
3. **Input limits** - 1-10,000 characters, validated via Zod. Empty strings throw `ValidationError`
4. **Provider caching** - factory caches providers by config. Same config returns same instance

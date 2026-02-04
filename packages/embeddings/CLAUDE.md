# Embeddings Package - CLAUDE.md

Provides local embedding generation using transformers.js for AI-powered job matching.

## Overview

This package generates semantic embeddings (vector representations) of text using the `all-MiniLM-L6-v2` model via transformers.js. Embeddings enable similarity-based job matching by comparing user profiles with job offers.

## Commands

```bash
npm run build        # Compile TypeScript to dist/
npm run check-types  # TypeScript validation
```

## Architecture

**Provider Pattern**: Clean separation between provider interface and implementations.

- `LocalProvider`: Uses transformers.js with all-MiniLM-L6-v2 (384 dimensions)
- `OpenAIProvider`: Placeholder for future OpenAI integration (not implemented)

**Factory Pattern**: Environment-driven provider selection via `EMBEDDING_PROVIDER` env var.

```
src/
├── index.ts              # Public API exports
├── factory.ts            # Provider factory with caching
├── types.ts              # TypeScript interfaces
├── errors.ts             # Custom error classes
├── validation.ts         # Zod input validation
└── providers/
    ├── local.ts          # Transformers.js implementation
    └── openai.ts         # Placeholder
```

## Usage

### Basic Usage (Default Provider)

```typescript
import { embeddings } from "@codeforge-v2/embeddings";

// Generate embedding for text
const embedding = await embeddings.generateEmbedding(
  "Software Engineer with 5 years experience in React and Node.js"
);

console.log(embedding.length); // 384
```

### Advanced Usage (Custom Provider)

```typescript
import { createEmbeddingProvider } from "@codeforge-v2/embeddings";

// Create specific provider instance
const provider = createEmbeddingProvider({ provider: "local" });

const embedding = await provider.generateEmbedding("Job description text");

console.log(provider.getDimensions()); // 384
console.log(provider.getName()); // "local (Xenova/all-MiniLM-L6-v2)"
```

### Error Handling

```typescript
import { embeddings, EmbeddingError } from "@codeforge-v2/embeddings";

try {
  const embedding = await embeddings.generateEmbedding(text);
} catch (error) {
  if (error instanceof EmbeddingError) {
    console.error(`Embedding failed: ${error.code} - ${error.message}`);
  }
}
```

## Integration Examples

### Onboarding Flow

```typescript
// apps/web/src/features/onboarding/api/complete-onboarding.ts
import { embeddings } from "@codeforge-v2/embeddings";

export async function completeOnboarding(data: OnboardingFormData) {
  // Generate embedding from profile data
  const profileText = `${data.jobTitle} | ${data.yearsExperience} years | ${data.skills.join(", ")} | ${data.idealRoleDescription}`;

  let embedding: number[] | null = null;
  try {
    embedding = await embeddings.generateEmbedding(profileText);
  } catch (error) {
    console.error("Failed to generate embedding:", error);
    // Continue without embedding - don't block onboarding
  }

  // Store profile with embedding
  await supabase.from("profiles").update({
    ...profileData,
    embedding: embedding,
  });
}
```

### Scraper Integration

```typescript
// apps/scraper/src/services/scraper.ts
import { embeddings } from "@codeforge-v2/embeddings";

async function processJobOffer(offer: JobOffer) {
  // Generate embedding from job data
  const jobText = `${offer.title} | ${offer.skills.join(", ")} | ${offer.description}`;

  let embedding: number[] | null = null;
  try {
    embedding = await embeddings.generateEmbedding(jobText);
  } catch (error) {
    console.error("Failed to generate embedding for offer:", error);
    // Continue without embedding
  }

  // Store offer with embedding
  await adminClient.from("offers").insert({
    ...offer,
    embedding: embedding,
  });
}
```

## Performance

**First Call Latency**: 2-5 seconds (includes model download + initialization)
- Model size: ~90MB
- Downloads once to `~/.cache/huggingface/transformers/`
- Cached across application restarts

**Subsequent Calls**: 100-500ms per embedding
- Model loaded once per process (singleton pattern)
- Fast vector generation after initialization

**Memory Usage**: ~100-200MB per process for loaded model

## Environment Variables

```bash
# Optional: Choose embedding provider (defaults to "local")
EMBEDDING_PROVIDER=local  # or "openai" (not implemented)
```

## Error Codes

- `MODEL_LOAD_FAILED`: Model failed to load or initialize
- `VALIDATION_FAILED`: Input validation failed (empty string, too long, etc.)
- `GENERATION_FAILED`: Embedding generation failed
- `PROVIDER_NOT_IMPLEMENTED`: Provider not yet implemented (e.g., OpenAI)
- `INVALID_DIMENSIONS`: Generated embedding has wrong dimensions

## Database Integration

Embeddings are stored as `VECTOR(384)` in PostgreSQL using pgvector extension:

```sql
-- Profiles table
ALTER TABLE public.profiles
  ADD COLUMN embedding VECTOR(384);

-- Job offers table
ALTER TABLE public.offers
  ADD COLUMN embedding VECTOR(384);

-- Similarity search function
CREATE FUNCTION match_jobs_for_user(
  user_embedding VECTOR(384),
  match_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (offer_id BIGINT, similarity FLOAT);
```

## Gotchas

1. **First call is slow**: Model downloads on first use. Pre-warm by calling during app initialization if needed.

2. **Model caching**: Transformers.js caches models in `~/.cache/huggingface/`. In Docker, mount this directory or accept cold starts.

3. **Memory requirements**: Ensure at least 512MB available memory for model loading.

4. **Input validation**: Text is trimmed and validated (1-10,000 characters). Empty strings throw `ValidationError`.

5. **Provider caching**: Providers are cached by factory. Creating multiple providers with same config returns cached instance.

## Future Enhancements

- OpenAI provider implementation (when needed for larger models)
- Batch processing optimization (parallel embedding generation)
- Retry logic for transient failures
- Telemetry and monitoring
- Support for different models (sentence-transformers, etc.)

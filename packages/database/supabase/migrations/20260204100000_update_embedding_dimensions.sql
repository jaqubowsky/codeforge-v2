-- ====================================================================
-- Update Embedding Dimensions for Local AI Model
-- Version: 1.0
-- Description: Changes embedding dimensions from 1536 (OpenAI) to 384
--              (all-MiniLM-L6-v2 via transformers.js)
-- ====================================================================

BEGIN;

-- ====================================================================
-- SECTION 1: Update profiles table embedding column
-- ====================================================================

-- Drop existing embedding column and recreate with new dimensions
ALTER TABLE public.profiles DROP COLUMN IF EXISTS embedding;
ALTER TABLE public.profiles ADD COLUMN embedding VECTOR(384);

COMMENT ON COLUMN public.profiles.embedding IS 'User profile embedding for AI-powered job matching (384 dimensions for all-MiniLM-L6-v2)';

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_profiles_embedding ON public.profiles
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

COMMENT ON INDEX idx_profiles_embedding IS 'IVFFlat index for fast cosine similarity search on profile embeddings';


-- ====================================================================
-- SECTION 2: Update offers table embedding column
-- ====================================================================

-- Add embedding column to offers table
ALTER TABLE public.offers DROP COLUMN IF EXISTS embedding;
ALTER TABLE public.offers ADD COLUMN embedding VECTOR(384);

COMMENT ON COLUMN public.offers.embedding IS 'Job offer embedding for AI-powered matching (384 dimensions for all-MiniLM-L6-v2)';

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_offers_embedding ON public.offers
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

COMMENT ON INDEX idx_offers_embedding IS 'IVFFlat index for fast cosine similarity search on job embeddings';


-- ====================================================================
-- SECTION 3: Create similarity search function
-- ====================================================================

CREATE OR REPLACE FUNCTION public.match_jobs_for_user(
  user_embedding VECTOR(384),
  match_threshold FLOAT DEFAULT 0.4,
  match_count INT DEFAULT 50
)
RETURNS TABLE (
  offer_id BIGINT,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT id AS offer_id, 1 - (embedding <=> user_embedding) AS similarity
  FROM public.offers
  WHERE embedding IS NOT NULL
    AND 1 - (embedding <=> user_embedding) >= match_threshold
  ORDER BY embedding <=> user_embedding
  LIMIT match_count;
$$;

COMMENT ON FUNCTION public.match_jobs_for_user IS 'Find job offers most similar to user profile using cosine similarity. Uses <=> operator for cosine distance (1 - distance = similarity).';

COMMIT;

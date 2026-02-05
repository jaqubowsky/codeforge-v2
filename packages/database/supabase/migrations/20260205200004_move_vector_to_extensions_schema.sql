-- Move vector extension from public to extensions schema for security
-- This prevents potential search_path manipulation attacks

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move the vector extension to extensions schema
ALTER EXTENSION vector SET SCHEMA extensions;

-- Update match_jobs_for_user function with fully qualified operator references
CREATE OR REPLACE FUNCTION public.match_jobs_for_user(
  user_embedding extensions.vector,
  match_threshold double precision DEFAULT 0.7,
  match_count integer DEFAULT 50
)
RETURNS TABLE(offer_id bigint, similarity double precision)
LANGUAGE sql
STABLE
SET search_path = 'public, extensions'
AS $function$
  SELECT id AS offer_id, 1 - (embedding OPERATOR(extensions.<=>) user_embedding) AS similarity
  FROM public.offers
  WHERE embedding IS NOT NULL
    AND 1 - (embedding OPERATOR(extensions.<=>) user_embedding) >= match_threshold
  ORDER BY embedding OPERATOR(extensions.<=>) user_embedding
  LIMIT match_count;
$function$;

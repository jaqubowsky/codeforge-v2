-- Fix functions to use SET search_path = '' for security
-- This prevents search_path manipulation attacks

-- Fix handle_updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Fix match_jobs_for_user function
-- Note: search_path includes 'public' because vector extension operators are in public schema
CREATE OR REPLACE FUNCTION public.match_jobs_for_user(
  user_embedding vector,
  match_threshold double precision DEFAULT 0.7,
  match_count integer DEFAULT 50
)
RETURNS TABLE(offer_id bigint, similarity double precision)
LANGUAGE sql
STABLE
SET search_path = 'public'
AS $function$
  SELECT id AS offer_id, 1 - (embedding <=> user_embedding) AS similarity
  FROM public.offers
  WHERE embedding IS NOT NULL
    AND 1 - (embedding <=> user_embedding) >= match_threshold
  ORDER BY embedding <=> user_embedding
  LIMIT match_count;
$function$;

-- Fix get_or_create_technology function
CREATE OR REPLACE FUNCTION public.get_or_create_technology(tech_name text)
RETURNS bigint
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
  tech_id BIGINT;
BEGIN
  INSERT INTO public.technologies (name)
  VALUES (tech_name)
  ON CONFLICT (LOWER(name)) DO NOTHING
  RETURNING id INTO tech_id;

  IF tech_id IS NULL THEN
    SELECT id INTO tech_id FROM public.technologies WHERE LOWER(name) = LOWER(tech_name);
  END IF;

  RETURN tech_id;
END;
$function$;

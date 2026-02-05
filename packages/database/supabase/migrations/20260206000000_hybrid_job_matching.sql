-- Hybrid job matching with skill normalization
--
-- This migration creates:
-- 1. normalize_skill() - Normalizes skill names for consistent matching
-- 2. match_jobs_for_user() - Hybrid matching with hard filters + semantic ranking
--
-- Key features:
-- - Skill normalization handles variants like NextJS/Next.js/next.JS
-- - Experience level filter (must match user preference)
-- - Workplace type filter (remote/hybrid/office)
-- - Minimum skill matches (default: at least 1 skill must match)
-- - Semantic similarity ranking (threshold: 0.3)

-- Drop old function signatures to avoid conflicts
DROP FUNCTION IF EXISTS public.match_jobs_for_user(extensions.vector, text[], text[], text[], text[], double precision, double precision, integer);
DROP FUNCTION IF EXISTS public.match_jobs_for_user(extensions.vector, double precision, integer);

-- Create skill normalization function
-- Handles: NextJS = Next.js = next.JS, TailwindCSS = Tailwind CSS = tailwind-css
CREATE OR REPLACE FUNCTION public.normalize_skill(skill_name text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(skill_name, '[.\-_\s]', '', 'g'),
      'js$', 'js', 'i'
    )
  );
END;
$$;

COMMENT ON FUNCTION public.normalize_skill IS
'Normalizes skill names for comparison by:
- Converting to lowercase
- Removing dots, dashes, underscores, spaces
Examples: NextJS = next.js = Next.JS, TailwindCSS = tailwind-css = Tailwind CSS';

-- Create hybrid job matching function
CREATE OR REPLACE FUNCTION public.match_jobs_for_user(
  user_embedding extensions.vector,
  user_job_titles text[],
  user_experience_levels text[],
  user_work_locations text[],
  user_skills text[],
  match_threshold double precision DEFAULT 0.3,
  min_skill_matches integer DEFAULT 1,
  match_count integer DEFAULT 50
)
RETURNS TABLE(
  offer_id bigint,
  similarity double precision,
  matching_skills_count integer,
  total_skills_count integer
)
LANGUAGE plpgsql
STABLE
SET search_path = 'public, extensions'
AS $function$
BEGIN
  RETURN QUERY
  WITH
  -- Normalize user skills once for efficient comparison
  normalized_user_skills AS (
    SELECT public.normalize_skill(unnest(user_skills)) AS skill
  ),
  -- Step 1: Apply hard filters (experience level, workplace type)
  filtered_offers AS (
    SELECT
      o.id,
      o.embedding,
      o.title
    FROM public.offers o
    WHERE
      o.embedding IS NOT NULL
      AND o.experience_level::text = ANY(user_experience_levels)
      AND o.workplace_type::text = ANY(user_work_locations)
  ),
  -- Step 2: Calculate skill matches using normalized comparison
  skill_counts AS (
    SELECT
      fo.id,
      fo.embedding,
      COUNT(DISTINCT ot.technology_id)::integer AS total_techs,
      COUNT(DISTINCT CASE
        WHEN public.normalize_skill(t.name) IN (SELECT skill FROM normalized_user_skills) THEN ot.technology_id
        ELSE NULL
      END)::integer AS matching_techs
    FROM filtered_offers fo
    LEFT JOIN public.offer_technologies ot ON fo.id = ot.offer_id
    LEFT JOIN public.technologies t ON ot.technology_id = t.id
    GROUP BY fo.id, fo.embedding
  ),
  -- Step 3: Filter by minimum skill matches (default: at least 1)
  skill_filtered AS (
    SELECT
      sc.id,
      sc.embedding,
      sc.matching_techs,
      sc.total_techs
    FROM skill_counts sc
    WHERE sc.matching_techs >= min_skill_matches
       OR sc.total_techs = 0  -- Include jobs with no technologies listed
  )
  -- Step 4: Calculate similarity and apply threshold, order by similarity
  SELECT
    sf.id AS offer_id,
    (1 - (sf.embedding OPERATOR(extensions.<=>) user_embedding))::double precision AS similarity,
    sf.matching_techs AS matching_skills_count,
    sf.total_techs AS total_skills_count
  FROM skill_filtered sf
  WHERE (1 - (sf.embedding OPERATOR(extensions.<=>) user_embedding)) >= match_threshold
  ORDER BY sf.embedding OPERATOR(extensions.<=>) user_embedding
  LIMIT match_count;
END;
$function$;

COMMENT ON FUNCTION public.match_jobs_for_user IS
'Hybrid job matching: hard filters + semantic ranking

Parameters:
- user_embedding: Profile embedding vector (384 dimensions)
- user_job_titles: Unused, kept for API compatibility
- user_experience_levels: Array of levels (junior, mid, senior, c-level)
- user_work_locations: Array of types (remote, hybrid, office)
- user_skills: Array of skill names (will be normalized)
- match_threshold: Minimum similarity score (default: 0.3)
- min_skill_matches: Minimum matching skills required (default: 1)
- match_count: Maximum results to return (default: 50)

Returns: offer_id, similarity, matching_skills_count, total_skills_count

Filtering pipeline:
1. Experience level must match one of user preferences
2. Workplace type must match one of user preferences
3. At least min_skill_matches skills must match (using normalization)
4. Similarity must be >= match_threshold
5. Results ordered by similarity descending';

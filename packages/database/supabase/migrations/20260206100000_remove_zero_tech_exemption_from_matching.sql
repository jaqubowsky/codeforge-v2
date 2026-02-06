-- ====================================================================
-- Remove Zero-Tech Exemption from Job Matching
-- Version: 1.0
-- Description: Removes the OR sc.total_techs = 0 clause from
--              match_jobs_for_user() so that offers with zero
--              technologies no longer bypass the skill filter.
-- ====================================================================

BEGIN;

-- ====================================================================
-- SECTION 1: Update match_jobs_for_user() Function
-- ====================================================================

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
  normalized_user_skills AS (
    SELECT public.normalize_skill(unnest(user_skills)) AS skill
  ),
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
  skill_filtered AS (
    SELECT
      sc.id,
      sc.embedding,
      sc.matching_techs,
      sc.total_techs
    FROM skill_counts sc
    WHERE sc.matching_techs >= min_skill_matches
  )
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

COMMIT;

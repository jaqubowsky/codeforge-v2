-- Exclude already-matched offers from SQL matching results
--
-- Previously: SQL returned top 50 by similarity without excluding user's existing offers.
-- The exclusion happened after re-ranking, so the top 50 slots were wasted on already-seen
-- offers, leaving 0 new matches even when 100+ eligible offers existed in the database.
--
-- Fix: Add excluded_offer_ids parameter to filter out already-matched offers before ranking.

DROP FUNCTION IF EXISTS public.match_jobs_for_user(extensions.vector, text[], text[], text[], text[], double precision, double precision, integer);

CREATE OR REPLACE FUNCTION public.match_jobs_for_user(
  user_embedding extensions.vector,
  user_job_titles text[],
  user_experience_levels text[],
  user_work_locations text[],
  user_skills text[],
  match_threshold double precision DEFAULT 0.3,
  min_skill_ratio double precision DEFAULT 0.3,
  match_count integer DEFAULT 50,
  excluded_offer_ids bigint[] DEFAULT '{}'
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
      AND o.id != ALL(excluded_offer_ids)
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
    WHERE sc.total_techs > 0
      AND sc.matching_techs >= CEIL(sc.total_techs * min_skill_ratio)
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

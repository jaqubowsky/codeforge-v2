ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS job_title,
  DROP COLUMN IF EXISTS years_experience,
  DROP COLUMN IF EXISTS job_titles;

ALTER TABLE public.match_runs
  DROP COLUMN IF EXISTS jobs_found;

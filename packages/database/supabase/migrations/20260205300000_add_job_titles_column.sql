-- ====================================================================
-- Add Job Titles array column to Profiles
-- Description: Replaces singular job_title with job_titles array
--              for multi-select job title preferences
-- ====================================================================

BEGIN;

-- Add job_titles as text array
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS job_titles TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.profiles.job_titles IS
  'User preferred job titles. Multi-select array of job role names.';

COMMIT;

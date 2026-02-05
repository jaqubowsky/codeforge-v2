-- ====================================================================
-- Convert Profile Preferences to Proper Enums
-- Version: 1.0
-- Description: Converts experience_level and preferred_locations from
--              TEXT[] with check constraints to proper enum arrays
-- ====================================================================

BEGIN;

-- ====================================================================
-- SECTION 1: Create the enums
-- ====================================================================

CREATE TYPE public.profile_experience_level AS ENUM (
  'junior', 'mid', 'senior', 'c-level'
);

CREATE TYPE public.profile_work_location AS ENUM (
  'remote', 'hybrid', 'office'
);

COMMENT ON TYPE public.profile_experience_level IS
  'Experience level preferences for job matching';
COMMENT ON TYPE public.profile_work_location IS
  'Work location preferences (remote, hybrid, office)';

-- ====================================================================
-- SECTION 2: Drop existing constraints
-- ====================================================================

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS check_experience_level_values,
  DROP CONSTRAINT IF EXISTS check_preferred_locations_values;

-- ====================================================================
-- SECTION 3: Convert experience_level column
-- ====================================================================

ALTER TABLE public.profiles
  ADD COLUMN experience_level_new public.profile_experience_level[] DEFAULT '{}';

UPDATE public.profiles
  SET experience_level_new = (
    SELECT ARRAY_AGG(val::profile_experience_level)
    FROM UNNEST(experience_level) AS val
    WHERE val IS NOT NULL
  )
  WHERE experience_level IS NOT NULL AND ARRAY_LENGTH(experience_level, 1) > 0;

ALTER TABLE public.profiles DROP COLUMN experience_level;
ALTER TABLE public.profiles RENAME COLUMN experience_level_new TO experience_level;

-- ====================================================================
-- SECTION 4: Convert preferred_locations column
-- ====================================================================

ALTER TABLE public.profiles
  ADD COLUMN preferred_locations_new public.profile_work_location[] DEFAULT '{}';

UPDATE public.profiles
  SET preferred_locations_new = (
    SELECT ARRAY_AGG(val::profile_work_location)
    FROM UNNEST(preferred_locations) AS val
    WHERE val IS NOT NULL
  )
  WHERE preferred_locations IS NOT NULL AND ARRAY_LENGTH(preferred_locations, 1) > 0;

ALTER TABLE public.profiles DROP COLUMN preferred_locations;
ALTER TABLE public.profiles RENAME COLUMN preferred_locations_new TO preferred_locations;

COMMIT;

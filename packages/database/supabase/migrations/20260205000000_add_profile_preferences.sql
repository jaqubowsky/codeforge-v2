-- ====================================================================
-- Add Experience Level and Location Preferences to Profiles
-- Version: 1.0
-- Description: Adds multi-select fields for experience levels and
--              work location preferences to user profiles
-- ====================================================================

BEGIN;

-- ====================================================================
-- SECTION 1: Add new columns to profiles table
-- ====================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS experience_level TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS preferred_locations TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.profiles.experience_level IS
  'User preferred experience levels (junior, mid, senior, c-level). Multi-select.';

COMMENT ON COLUMN public.profiles.preferred_locations IS
  'User preferred work locations (remote, hybrid, office). Multi-select.';

-- ====================================================================
-- SECTION 2: Add constraints for valid values
-- ====================================================================

-- Constraint for experience_level values
ALTER TABLE public.profiles
  ADD CONSTRAINT check_experience_level_values
  CHECK (
    experience_level <@ ARRAY['junior', 'mid', 'senior', 'c-level']::TEXT[]
  );

-- Constraint for preferred_locations values
ALTER TABLE public.profiles
  ADD CONSTRAINT check_preferred_locations_values
  CHECK (
    preferred_locations <@ ARRAY['remote', 'hybrid', 'office']::TEXT[]
  );

COMMENT ON CONSTRAINT check_experience_level_values ON public.profiles IS
  'Ensures experience_level array only contains valid values';

COMMENT ON CONSTRAINT check_preferred_locations_values ON public.profiles IS
  'Ensures preferred_locations array only contains valid values';

COMMIT;

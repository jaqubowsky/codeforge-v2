-- ====================================================================
-- Add Match Runs Update Policy
-- Version: 1.0
-- Description: Adds missing UPDATE policy for match_runs table to allow
--              users to update their own match run records (status, etc.)
-- ====================================================================

BEGIN;

-- ====================================================================
-- SECTION 1: Row Level Security Policies
-- ====================================================================

-- Allow users to update their own match runs
CREATE POLICY "Users can update their own match runs"
  ON public.match_runs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

COMMIT;

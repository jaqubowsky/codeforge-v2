-- ====================================================================
-- Add 'deleted' status to job_status_enum
-- Version: 1.0
-- Description: Adds soft-delete status to job status enum for hiding
--              jobs without permanently removing them
-- ====================================================================

ALTER TYPE public.job_status_enum ADD VALUE IF NOT EXISTS 'deleted';

COMMENT ON TYPE public.job_status_enum IS
  'Job application status: saved (inbox), applied, interviewing, rejected, offer_received, deleted (soft-delete)';

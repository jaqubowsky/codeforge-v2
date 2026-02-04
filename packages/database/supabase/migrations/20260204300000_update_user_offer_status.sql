BEGIN;

CREATE TYPE public.job_status_enum AS ENUM (
  'saved', 'applied', 'interviewing', 'rejected', 'offer_received'
);

ALTER TABLE public.user_offers
  ADD COLUMN status_new public.job_status_enum;

UPDATE public.user_offers
  SET status_new = CASE
    WHEN status = 'inbox' THEN 'saved'::job_status_enum
    WHEN status = 'saved' THEN 'saved'::job_status_enum
    WHEN status = 'archived' THEN 'rejected'::job_status_enum
  END;

ALTER TABLE public.user_offers
  ALTER COLUMN status_new SET NOT NULL,
  ALTER COLUMN status_new SET DEFAULT 'saved';

ALTER TABLE public.user_offers DROP COLUMN status;
DROP TYPE public.user_offer_status;

ALTER TABLE public.user_offers
  RENAME COLUMN status_new TO status;

DROP INDEX IF EXISTS idx_user_offers_status;
DROP INDEX IF EXISTS idx_user_offers_user_status;
CREATE INDEX idx_user_offers_status ON public.user_offers(status);
CREATE INDEX idx_user_offers_user_status ON public.user_offers(user_id, status);

COMMENT ON TYPE public.job_status_enum IS
  'Job application status: saved (inbox), applied, interviewing, rejected, offer_received';

COMMIT;

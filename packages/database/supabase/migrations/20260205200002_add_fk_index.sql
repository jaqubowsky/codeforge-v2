-- Add index on user_offers.offer_id for foreign key performance
-- This improves JOIN performance and foreign key constraint checks
CREATE INDEX IF NOT EXISTS idx_user_offers_offer_id ON public.user_offers(offer_id);

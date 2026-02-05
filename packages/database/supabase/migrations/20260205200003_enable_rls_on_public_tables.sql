-- Enable RLS on tables that were missing it
-- offers, technologies, offer_technologies: read-only for authenticated users
-- scraping_runs: admin-only (no user policies, access via adminClient)

-- Enable RLS on offers table
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view offers" ON public.offers
  FOR SELECT TO authenticated
  USING (true);

-- Enable RLS on technologies table
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view technologies" ON public.technologies
  FOR SELECT TO authenticated
  USING (true);

-- Enable RLS on offer_technologies table
ALTER TABLE public.offer_technologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view offer_technologies" ON public.offer_technologies
  FOR SELECT TO authenticated
  USING (true);

-- Enable RLS on scraping_runs table (admin-only, no user policies)
ALTER TABLE public.scraping_runs ENABLE ROW LEVEL SECURITY;
-- No SELECT policy = only adminClient (service role) can access

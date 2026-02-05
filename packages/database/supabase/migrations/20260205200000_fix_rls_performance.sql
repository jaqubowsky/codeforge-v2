-- Fix RLS policies to use (select auth.uid()) instead of auth.uid()
-- This prevents re-evaluation of auth.uid() for every row scanned

-- Fix profiles RLS policies (profiles.id = auth.uid())
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);

-- Fix user_offers RLS policies
DROP POLICY IF EXISTS "Users can view their own offers" ON public.user_offers;
DROP POLICY IF EXISTS "Users can insert their own offers" ON public.user_offers;
DROP POLICY IF EXISTS "Users can update their own offers" ON public.user_offers;
DROP POLICY IF EXISTS "Users can delete their own offers" ON public.user_offers;

CREATE POLICY "Users can view their own offers" ON public.user_offers
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own offers" ON public.user_offers
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own offers" ON public.user_offers
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own offers" ON public.user_offers
  FOR DELETE USING ((select auth.uid()) = user_id);

-- Fix match_runs RLS policies
DROP POLICY IF EXISTS "Users can view their own match runs" ON public.match_runs;
DROP POLICY IF EXISTS "Users can insert their own match runs" ON public.match_runs;
DROP POLICY IF EXISTS "Users can update their own match runs" ON public.match_runs;

CREATE POLICY "Users can view their own match runs" ON public.match_runs
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own match runs" ON public.match_runs
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own match runs" ON public.match_runs
  FOR UPDATE USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

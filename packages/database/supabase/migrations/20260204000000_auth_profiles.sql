-- ====================================================================
-- Authentication & User Profiles Migration
-- Version: 1.0
-- Description: Adds pgvector extension, profiles table, RLS policies,
--              and auto-creation trigger for user signup
-- ====================================================================

BEGIN;

-- ====================================================================
-- SECTION 1: Enable pgvector extension for AI-powered job matching
-- ====================================================================
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

COMMENT ON EXTENSION vector IS 'Vector similarity search for AI-powered job matching';


-- ====================================================================
-- SECTION 2: Create profiles table
-- ====================================================================
CREATE TABLE public.profiles (
    -- Primary key linked to auth.users (1:1 relationship)
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Profile Information (for future onboarding)
    job_title TEXT,
    years_experience INT,
    skills TEXT[],
    ideal_role_description TEXT,

    -- Onboarding tracking
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,

    -- For AI job matching (Milestone 3)
    embedding VECTOR(1536),

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'User profiles automatically created on signup, linked to auth.users';
COMMENT ON COLUMN public.profiles.id IS 'Foreign key to auth.users.id';
COMMENT ON COLUMN public.profiles.onboarding_completed IS 'Tracks whether user has completed onboarding flow';
COMMENT ON COLUMN public.profiles.embedding IS 'User profile embedding for AI-powered job matching (1536 dimensions for OpenAI ada-002)';


-- ====================================================================
-- SECTION 3: Create indexes for performance
-- ====================================================================
CREATE INDEX idx_profiles_onboarding_completed ON public.profiles (onboarding_completed);


-- ====================================================================
-- SECTION 4: Row Level Security (RLS) policies
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (needed for trigger to work with RLS)
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);


-- ====================================================================
-- SECTION 5: Automatic profile creation trigger
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, onboarding_completed, created_at, updated_at)
    VALUES (NEW.id, FALSE, NOW(), NOW());
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates a profile row when a new user signs up';

-- Attach trigger to auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ====================================================================
-- SECTION 6: Updated at trigger for profiles
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

COMMIT;

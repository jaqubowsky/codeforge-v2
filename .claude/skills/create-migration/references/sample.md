# Example: Creating a Job Bookmarks Migration

## User Request
```
User: /create-migration
```

## Claude Response
```
What should this migration do? (snake_case description)
```

## User Input
```
User: add_job_bookmarks
```

## Claude Output
```
✓ Created migration: packages/database/supabase/migrations/20260204120000_add_job_bookmarks.sql

The migration file has been created with the following template sections:
- Table creation
- Indexes
- Row Level Security policies
- Triggers/functions

Next steps:
1. Edit the migration file with your DDL
2. Test locally: supabase db reset
3. Deploy via Supabase dashboard or CLI

Migration best practices:
- Enable RLS for tables with user data
- Add indexes for foreign keys and frequently queried columns
- Use transactions (BEGIN/COMMIT) for atomicity
- Add comments to explain non-obvious decisions
```

## Generated File
**packages/database/supabase/migrations/20260204120000_add_job_bookmarks.sql**:

```sql
-- ====================================================================
-- Add Job Bookmarks
-- Version: 1.0
-- Description: Adds job_bookmarks table for users to save job offers
-- ====================================================================

BEGIN;

-- ====================================================================
-- SECTION 1: Create Tables
-- ====================================================================

CREATE TABLE public.job_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_offer_id UUID NOT NULL REFERENCES public.job_offers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate bookmarks
    UNIQUE(user_id, job_offer_id)
);

COMMENT ON TABLE public.job_bookmarks IS 'User bookmarks for job offers';


-- ====================================================================
-- SECTION 2: Create Indexes
-- ====================================================================

CREATE INDEX idx_job_bookmarks_user_id ON public.job_bookmarks(user_id);
CREATE INDEX idx_job_bookmarks_job_offer_id ON public.job_bookmarks(job_offer_id);


-- ====================================================================
-- SECTION 3: Row Level Security Policies
-- ====================================================================

ALTER TABLE public.job_bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
    ON public.job_bookmarks
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own bookmarks
CREATE POLICY "Users can create own bookmarks"
    ON public.job_bookmarks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
    ON public.job_bookmarks
    FOR DELETE
    USING (auth.uid() = user_id);


-- ====================================================================
-- SECTION 4: Triggers/Functions
-- ====================================================================

-- No triggers needed for this migration


COMMIT;
```

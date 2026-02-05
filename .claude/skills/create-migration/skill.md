---
name: create-migration
description: Creates Supabase migration files with proper naming, structure, and best practices. Use when (1) user wants to create a new database migration, (2) adding/modifying tables, columns, or constraints, (3) adding indexes for performance, (4) setting up Row Level Security (RLS) policies, (5) creating triggers or functions, (6) any database schema changes. Example requests include "create migration", "add table for bookmarks", "add column to users", "set up RLS", "create database trigger".
---

# Database Migration

When creating a migration:

1. **Ask for migration description**:
   - Prompt user for migration name in snake_case
   - Examples: "add_job_bookmarks", "update_profiles_schema", "add_email_templates"

2. **Generate timestamped filename**:
   - Format: `YYYYMMDDHHMMSS_description.sql`
   - Use current date/time
   - Example: `20260204120000_add_job_bookmarks.sql`

3. **Create file** in `packages/database/supabase/migrations/` with this template:

```sql
-- ====================================================================
-- [Migration Title]
-- Version: 1.0
-- Description: [Brief description of what this migration does]
-- ====================================================================

BEGIN;

-- ====================================================================
-- SECTION 1: [e.g., Create Tables]
-- ====================================================================

-- Add your DDL here


-- ====================================================================
-- SECTION 2: [e.g., Create Indexes]
-- ====================================================================

-- Add indexes for performance


-- ====================================================================
-- SECTION 3: [e.g., Row Level Security Policies]
-- ====================================================================

-- Enable RLS
-- ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;

-- Add RLS policies


-- ====================================================================
-- SECTION 4: [e.g., Triggers/Functions]
-- ====================================================================

-- Add triggers or functions if needed


COMMIT;
```

4. **Remind about best practices**:
   - Test locally first with Supabase CLI
   - Always enable RLS for tables with user data
   - Add indexes for foreign keys and frequently queried columns
   - Wrap in BEGIN/COMMIT for atomicity
   - Add comments to explain non-obvious decisions

5. **Output next steps**:
   ```
   ✓ Created migration: packages/database/supabase/migrations/[filename]

   Next steps:
   1. Edit the migration file with your DDL
   2. Test locally: supabase db reset
   3. Deploy via Supabase dashboard or CLI
   ```

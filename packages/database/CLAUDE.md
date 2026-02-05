# Database Package - CLAUDE.md

Supabase client, queries, and generated TypeScript types.

## Commands

```bash
pnpm build        # Generate TypeScript types from Supabase schema
pnpm check-types  # TypeScript validation
```

## Package Structure

```
src/
├── client.ts          # Supabase clients (client & adminClient)
├── queries.ts         # Database query functions
├── env.ts             # Environment variable validation (Zod)
├── database.types.ts  # Auto-generated from Supabase schema
└── index.ts           # Public exports
```

## Client vs AdminClient - CRITICAL

**Use `client` for**:
- User-scoped queries (respects RLS policies)
- Client-side operations
- Reading data visible to current user

**Use `adminClient` for**:
- Server-side operations requiring elevated privileges
- Creating user profiles (bypasses RLS)
- Scraper writes
- Admin operations

```typescript
import { client, adminClient } from "@codeforge-v2/database";

// ✅ User-scoped read
const { data } = await client.from("profiles").select("*");

// ✅ Server action creating profile (bypasses RLS)
const { data } = await adminClient.from("profiles").insert({ ... });

// ❌ DON'T use adminClient for user reads (bypasses security)
```

**Gotcha**: `adminClient` requires `SUPABASE_SERVICE_KEY` environment variable. It bypasses Row Level Security (RLS), so only use in trusted server contexts.

## Database Schema

**Key tables**:

```sql
profiles
  - id (uuid, FK to auth.users)
  - job_title (text)
  - years_experience (int)
  - skills (text[])
  - ideal_role_description (text)
  - onboarding_completed (boolean)
  - embedding (vector(384))  # For local AI job matching (all-MiniLM-L6-v2)
  - created_at, updated_at

job_offers
  - [Schema from scraper - see apps/scraper/CLAUDE.md]
```

**Embeddings**: Uses 384 dimensions for `all-MiniLM-L6-v2` model (transformers.js). NOT OpenAI's 1536 dimensions. See Milestone 2.5 in `tasks.md` for implementation details.

## Migrations

**Location**: `supabase/migrations/`

**Recent migrations**:
- `20260204000000_auth_profiles.sql` - Adds profiles table, pgvector extension, RLS policies, and auto-creation trigger

**Workflow**:
1. Create migration file in `supabase/migrations/`
2. Test locally with Supabase CLI
3. Deploy to production via Supabase dashboard or CLI

**Gotcha**: Profiles are auto-created via trigger when user signs up. Don't manually create profiles—let the trigger handle it.

## Environment Variables

This package validates required environment variables on import:

```typescript
// env.ts validates these with Zod:
NEXT_PUBLIC_SUPABASE_URL       # Required
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Required
SUPABASE_SERVICE_KEY           # Optional (required for adminClient)
```

If validation fails, app won't start—you'll see clear error messages.

## TypeScript Types

Types are auto-generated from Supabase schema to `src/database.types.ts`.

**Regenerate types**:
```bash
pnpm build  # In packages/database
```

**Usage**:
```typescript
import type { Database } from "@codeforge-v2/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
```

## Row Level Security (RLS)

**Profiles table policies**:
- Users can read their own profile
- Users can update their own profile
- Profile creation handled by trigger (bypass via adminClient)

See migration file for full RLS policy definitions.

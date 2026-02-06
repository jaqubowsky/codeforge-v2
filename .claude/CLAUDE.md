# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Codeforge-v2 is a TypeScript monorepo for job offer scraping and display. It uses pnpm workspaces with Turborepo for build orchestration.

## Architecture

```
apps/
├── web/              # Next.js 16 frontend (React 19, App Router)
└── scraper/          # Google Cloud Functions serverless scraper

packages/
├── database/         # Supabase client, queries, and generated types
├── embeddings/       # AI embeddings + cross-encoder re-ranking for job matching (transformers.js)
├── scraper/          # Core scraping logic for job offers (strategy pattern)
├── ui/               # Shared shadcn/ui components (Radix primitives)
└── typescript-config/# Shared tsconfig presets (base, nextjs, react-library)
```

See app/package-specific CLAUDE.md files for detailed context:
- `apps/web/CLAUDE.md` - Routes, forms, server actions, co-location, type decoupling
- `apps/scraper/CLAUDE.md` - Scraping strategies, deployment
- `packages/database/CLAUDE.md` - Schema, migrations, client vs adminClient usage
- `packages/embeddings/CLAUDE.md` - Bi-encoder + cross-encoder, two-stage retrieval, provider pattern
- `packages/scraper/CLAUDE.md` - Scraping pipeline, strategy pattern, adding job boards
- `packages/ui/CLAUDE.md` - Component inventory, custom components, theme system
- `packages/typescript-config/CLAUDE.md` - Shared presets (base, nextjs, react-library)

## Getting Started

1. **Clone and install**:
   ```bash
   git clone <repo-url>
   pnpm install
   ```

2. **Environment setup**:
   - Copy `apps/web/.env.example` to `apps/web/.env.local`
   - Copy `apps/scraper/.env.example` to `apps/scraper/.env`
   - Fill in Supabase credentials (URL, anon key, service key)

3. **Start development**:
   ```bash
   pnpm run dev        # Start all apps (web on port 3001)
   pnpm run dev:web    # Web app only
   ```

## Development Commands

```bash
# Development
pnpm run dev           # Start all apps (web on port 3001)
pnpm run dev:web       # Web app only

# Build & validation
pnpm run build         # Production build all packages and apps (via Turborepo)
pnpm run check-types   # TypeScript validation across workspace (via Turborepo)
pnpm run lint          # Lint entire workspace (Ultracite/Biome, root-level)

# Testing
pnpm run test          # Run all tests across workspace (via Turborepo)

# Code quality
pnpm run fix           # Auto-fix with Ultracite/Biome
pnpm run check         # Check without fixing (root only)
pnpm run knip          # Find unused exports, deps, and files

# Dependency management (via Turborepo)
pnpm run check-deps    # Check for outdated dependencies
pnpm run update-deps   # Update dependencies interactively
```

## Post-Feature Validation (IMPORTANT)

**After implementing any feature or making code changes, ALWAYS run these commands to validate:**

```bash
# 1. Run tests (catches regressions in core logic)
pnpm run test

# 2. Build all packages (catches import/export errors)
pnpm run build

# 3. Type check (catches TypeScript errors)
pnpm run check-types

# 4. Lint (catches code style and potential bugs)
pnpm run lint

# 5. Check for unused code (catches dead code)
pnpm run knip
```

**Quick validation (runs all checks):**
```bash
pnpm run test && pnpm run check-types && pnpm run lint && pnpm run knip
```

These same checks run automatically via Husky hooks (pre-commit: lint-staged + check-types + knip; pre-push: test). If any command fails, fix the issues before committing.

**Project conventions** (enforced by linter):
- No `console.log` or `debugger` in production
- No code comments (self-documenting code preferred)
- Prefer `unknown` over `any`
- Use `import type` for types only
- No enums—use const objects or union types
- Function components only with hooks at top level
- Complete dependency arrays in useEffect/useMemo/useCallback
- Early returns over nested conditionals
- Unused catch variables must be prefixed with underscore (e.g., `catch (_error)`)

**Type safety conventions**:
- Avoid type assertions (`as`)—use Zod `.parse()`, typed variables, or explicit return type annotations instead
- `as` is only acceptable for external API boundaries (`response.json() as Promise<T>`) where we have no control
- Use named types from DB enums (e.g., `EmploymentType`, `WorkplaceType`) instead of inline string literal unions
- Use typed variables for literal values: `const period: SalaryPeriod = "month"` not `"month" as SalaryPeriod`
- Use explicit return type annotations to narrow literals: `.map((x): MyType => ({ ... }))` not `as const`
- Convert embeddings with `JSON.stringify()` for DB storage, never cast the parent object

**File naming conventions**:
- `index.ts` is ONLY for barrel exports (re-exports from other files)
- Files with logic/definitions get descriptive names: `dashboard.ts`, `filter-options.ts`, `profile.ts`
- Import from named files: `from "../types/dashboard"` not `from "../types"`

## Package Imports

```typescript
// UI components
import { Button } from "@codeforge-v2/ui/components/button";
import { cn } from "@codeforge-v2/ui/lib/utils";

// Extended Badge with semantic variants
import { Badge } from "@codeforge-v2/ui/components/badge";
// Available variants: default, secondary, destructive, outline, success, warning, info, remote, hybrid, office

// Database
import { client, adminClient } from "@codeforge-v2/database";

// Embeddings (bi-encoder for vector generation)
import { embeddings, EmbeddingError } from "@codeforge-v2/embeddings";

// Reranker (cross-encoder for precision re-ranking)
import { reranker, RerankingError, formatProfileQuery, formatJobDocument } from "@codeforge-v2/embeddings";
```

**Important**: See `packages/database/CLAUDE.md` for `client` vs `adminClient` usage patterns. See `packages/embeddings/CLAUDE.md` for two-stage retrieval architecture.

## Environment Variables

**Required for both apps** (from `@codeforge-v2/database` package):
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_KEY` - Service role key (scraper only)

Environment variables are validated on import via Zod schema. See `packages/database/src/env.ts` for validation rules.


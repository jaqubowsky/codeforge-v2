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
├── embeddings/       # Local AI embeddings for job matching (transformers.js)
├── scraper/          # Core scraping logic for job offers (strategy pattern)
├── ui/               # Shared shadcn/ui components (Radix primitives)
└── typescript-config/# Shared tsconfig presets (base, nextjs, react-library)
```

See app/package-specific CLAUDE.md files for detailed context:
- `apps/web/CLAUDE.md` - Auth system, routes, Next.js patterns
- `apps/scraper/CLAUDE.md` - Scraping strategies, deployment
- `packages/database/CLAUDE.md` - Schema, migrations, client vs adminClient usage
- `packages/embeddings/CLAUDE.md` - Provider pattern, performance, error codes
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
# 1. Build all packages (catches import/export errors)
pnpm run build

# 2. Type check (catches TypeScript errors)
pnpm run check-types

# 3. Lint (catches code style and potential bugs)
pnpm run lint

# 4. Check for unused code (catches dead code)
pnpm run knip
```

**Quick validation (runs all checks):**
```bash
pnpm run check-types && pnpm run lint && pnpm run knip
```

These same checks run automatically on pre-commit via Husky hooks. If any command fails, fix the issues before committing.

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

**Architecture conventions**:
- Extract ALL business logic to custom hooks
- Keep components presentation-only (JSX + props)
- Extract constants to UPPER_CASE variables
- No nested ternary expressions—use helper functions with if/else
- Early returns with curly braces for block statements
- Features cannot import from other features (maintain isolation)
- Single-use constants belong close to usage, not in centralized constants file

**File naming conventions**:
- `index.ts` is ONLY for barrel exports (re-exports from other files)
- Files with logic/definitions get descriptive names: `dashboard.ts`, `filter-options.ts`, `profile.ts`
- Import from named files: `from "../types/dashboard"` not `from "../types"`

**Co-location pattern** (component-specific logic):
```
components/
├── simple-component.tsx           # Simple component - no wrapper folder needed
└── complex-component/             # Component with specific hooks/utils
    ├── index.ts                   # Barrel export: export { ComplexComponent } from "./complex-component"
    ├── complex-component.tsx      # The component itself
    ├── use-complex-hook.ts        # Component-specific hook (co-located)
    └── complex-utils.ts           # Component-specific utils (co-located)
```

**When to co-locate**:
- Hook/util used by ONE component → put it IN that component's wrapper folder
- Hook/util used by 2+ components → put it in feature-level `hooks/` or `utils/` folder

## Web App Route Structure

```
apps/web/src/app/
├── (app)/                    # Authenticated routes with sidebar layout
│   ├── layout.tsx            # Auth check (requires onboarding), sidebar, navigation
│   ├── dashboard/page.tsx    # /dashboard - main job listings
│   └── profile/page.tsx      # /profile - user profile settings
├── (auth)/                   # Public auth pages (redirects away if authenticated)
│   ├── layout.tsx            # Auth check (redirects to /dashboard if logged in)
│   ├── login/page.tsx        # /login
│   └── signup/page.tsx       # /signup
├── api/auth/callback/route.ts # /api/auth/callback - OAuth callback handler
├── onboarding/page.tsx       # /onboarding - post-auth profile setup
├── layout.tsx                # Root layout (providers, fonts)
└── page.tsx                  # / - landing page
```

**Route groups**:
- `(app)` - Authenticated + onboarding completed. Has sidebar layout.
- `(auth)` - Public pages. Redirects to dashboard if already authenticated.
- `onboarding` - Authenticated but onboarding NOT completed. Separate from both groups.

**Why onboarding is outside both groups**:
- Can't be in `(app)` - would cause redirect loop (app requires onboarding → redirects to onboarding)
- Can't be in `(auth)` - requires authentication (auth pages redirect authenticated users away)

## Form Management

This project uses **react-hook-form** with **Zod resolver** for all forms.

**Pattern**:
```typescript
// schemas/[feature-name].ts - Define schema with Zod
export const myFormSchema = z.object({
  field: z.string().min(1, "Required"),
});
export type MyFormData = z.infer<typeof myFormSchema>;

// components/my-form/use-my-form.ts - Extract all form logic to custom hook (co-located)
export function useMyForm() {
  const form = useForm<MyFormData>({
    resolver: zodResolver(myFormSchema),
    defaultValues: { field: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: MyFormData) => {
    // submission logic
  };

  return { ...form, onSubmit };
}

// components/my-form/my-form.tsx - Presentation only with Controller
export function MyForm() {
  const { control, errors, handleSubmit, onSubmit } = useMyForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="field"
        render={({ field }) => <Input {...field} />}
      />
    </form>
  );
}
```

**Rules**:
- ALL form logic in custom hooks (validation, submission, state)
- Components are presentation-only
- Use Controller for form fields
- Zod schemas define both validation and TypeScript types

## API Response Pattern

Server actions return discriminated unions for type-safe error handling:

```typescript
// api/actions.ts
import { ok, err, type Result } from "@/shared/api";

export async function myAction(): Promise<Result<MyData>> {
  if (error) return err("Error message");
  return ok(data);
}

// Consumer - TypeScript narrows type after success check
const result = await myAction();
if (!result.success) {
  toast.error(result.error); // error is string
  return;
}
console.log(result.data); // data is MyData
```

## Database Type Decoupling

App types are standalone (no database imports). Mappers convert database types to app types.

```
features/example/
├── types/
│   └── example.ts        # App types (NO database imports) - named file, not index.ts
├── api/
│   ├── mappers/
│   │   └── example.ts    # Import Database types here, export mappers
│   └── my-action.ts      # Uses mapper, returns Result<AppType>
└── index.ts              # Barrel exports ONLY
```

**Type rules**:
- App types (`types/`) must NOT import from `@codeforge-v2/database`
- Only mappers (`api/mappers/`) import database types
- Use `Pick<DatabaseRow, "field1" | "field2">` for DTOs in mappers

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
```

**Important**: See `packages/database/CLAUDE.md` for `client` vs `adminClient` usage patterns.

## Environment Variables

**Required for both apps** (from `@codeforge-v2/database` package):
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_KEY` - Service role key (scraper only)

Environment variables are validated on import via Zod schema. See `packages/database/src/env.ts` for validation rules.


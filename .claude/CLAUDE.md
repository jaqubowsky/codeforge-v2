# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Codeforge-v2 is a TypeScript monorepo for job offer scraping and display. It uses npm workspaces with Turborepo for build orchestration.

## Architecture

```
apps/
├── web/              # Next.js 16 frontend (React 19, App Router)
└── scraper/          # Google Cloud Functions serverless scraper

packages/
├── database/         # Supabase client, queries, and generated types
├── embeddings/       # Local AI embeddings for job matching (transformers.js)
├── ui/               # Shared shadcn/ui components (Radix primitives)
└── typescript-config/# Shared tsconfig presets (base, nextjs, react-library)
```

**Data flow**: Scraper fetches job offers from boards (e.g., JustJoinIT) using Playwright, validates with Zod schemas, stores in Supabase. Web app displays data with AI-powered matching.

**Key features**:
- Authentication via Supabase Auth (email/password)
- User profiles with onboarding flow
- AI job matching prep (pgvector embeddings for future matching)

See app/package-specific CLAUDE.md files for detailed context:
- `apps/web/CLAUDE.md` - Auth system, routes, Next.js patterns
- `apps/scraper/CLAUDE.md` - Scraping strategies, deployment
- `packages/database/CLAUDE.md` - Schema, migrations, client usage

## Getting Started

1. **Clone and install**:
   ```bash
   git clone <repo-url>
   npm install
   ```

2. **Environment setup**:
   - Copy `apps/web/.env.example` to `apps/web/.env.local`
   - Copy `apps/scraper/.env.example` to `apps/scraper/.env`
   - Fill in Supabase credentials (URL, anon key, service key)

3. **Start development**:
   ```bash
   npm run dev        # Start all apps (web on port 3001)
   npm run dev:web    # Web app only
   ```

## Development Commands

```bash
# Development
npm run dev           # Start all apps (web on port 3001)
npm run dev:web       # Web app only

# Build & validation
npm run build         # Production build all
npm run check-types   # TypeScript validation across workspace

# Code quality
npm run fix           # Auto-fix with Ultracite/Biome
npm run check         # Check without fixing
```

## Form Management

This project uses **react-hook-form** with **Zod resolver** for all forms.

**Pattern**:
```typescript
// schemas.ts - Define schema with Zod
export const myFormSchema = z.object({
  field: z.string().min(1, "Required"),
});
export type MyFormData = z.infer<typeof myFormSchema>;

// hooks/use-my-form.ts - Extract all form logic to custom hook
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

// component.tsx - Presentation only with Controller
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

## Code Quality

This project uses **Ultracite** (Biome-based) with pre-commit hooks. Code is auto-formatted on commit via Husky + lint-staged.

**Commands**:
- `npm run fix` - Format and fix all issues
- `npm run check` - Check without fixing

**Project conventions** (enforced by linter):
- No `console.log` or `debugger` in production
- Prefer `unknown` over `any`
- Use `import type` for types only
- No enums—use const objects or union types
- Function components only with hooks at top level
- Complete dependency arrays in useEffect/useMemo/useCallback
- Early returns over nested conditionals

**Architecture conventions**:
- Extract ALL business logic to custom hooks
- Keep components presentation-only (JSX + props)
- Extract constants to UPPER_CASE variables
- No nested ternary expressions—use helper functions with if/else
- Early returns with curly braces for block statements

## Package Imports

```typescript
// UI components
import { Button } from "@codeforge-v2/ui/components/button";
import { cn } from "@codeforge-v2/ui/lib/utils";

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

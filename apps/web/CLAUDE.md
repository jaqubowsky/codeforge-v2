# Web App - CLAUDE.md

Next.js 16 frontend with React 19 (App Router), Supabase Auth, and job offer display.

## Commands

```bash
npm run dev          # Start dev server on port 3001
npm run build        # Production build
npm run check-types  # TypeScript validation
npx biome check --write --unsafe .  # Auto-fix linter issues (use --unsafe for unused variables)
```

## Route Structure

```
/                    # Homepage (job offers)
/login               # Email/password login
/signup              # Email/password signup
/onboarding          # Profile setup after signup
/auth/callback       # Supabase auth callback handler
```

## Authentication Flow

**Signup flow**: `/signup` → email confirmation → `/auth/callback` → `/onboarding` → `/`

**Key files**:
- `src/features/auth/` - Auth components, API, types, constants
  - `api/` - Server actions for auth operations
  - `components/` - Login/signup forms
  - `types/` - Auth type definitions
  - `constants/` - Auth-related constants
- `src/shared/auth/get-auth-state.ts` - Server helper for auth checks (use this in pages)
- `src/proxy.ts` - Next.js 16 proxy (session refresh only, no redirects)
- `src/app/auth/callback/` - Auth callback route handler
- `src/app/login/page.tsx` - Login page (redirects to `/` if authenticated)
- `src/app/signup/page.tsx` - Signup page (redirects to `/` if authenticated)
- `src/app/onboarding/page.tsx` - User profile setup (redirects if completed)
- `src/app/page.tsx` - Home page (redirects to `/login` or `/onboarding` as needed)

**Gotcha**: Auth forms use server actions from `src/features/auth/api/`. The callback route validates the auth code and redirects to `/onboarding` for new users.

**Redirect flow**:
1. All pages use `getAuthState()` to check authentication/onboarding status
2. Pages handle their own redirects using `redirect()` from `next/navigation`
3. Proxy only refreshes session, no redirect logic (keeps it clean and predictable)

## Next.js 16 Patterns

**App Router**:
- Server Components by default
- Use `"use client"` only when needed (forms, interactivity)
- Metadata API for SEO (not `<Head>`)

**Data fetching**:
- Use Suspense boundaries to avoid blocking page render
- Extract data fetching into separate components wrapped in `<Suspense>`
- Use `revalidatePath()` in server actions to refresh data after mutations
- Next.js automatically deduplicates requests within a single render

**Constants organization**:
- Single-use constants live close to usage (in same file or feature-specific)
- Only centralize constants used by 3+ files
- Extract inline strings/magic numbers to `const UPPER_CASE` in same file

**Auth redirects pattern**:
- Wrap auth checks in `<Suspense>` to avoid blocking page render
- Use reusable `AuthRedirect` component for common auth/onboarding checks
- Convert pages with redirect logic from async to sync with Suspense wrapper

**Proxy (formerly middleware)**:
- In Next.js 16, middleware is now called "proxy" (`src/proxy.ts`)
- **Keep proxy minimal** - only handle session refresh, no redirects
- Handle auth/onboarding redirects in page components using `getAuthState()` helper
- Use `redirect()` from `next/navigation` in server components

**Redirect pattern**:
```typescript
// src/shared/auth/get-auth-state.ts - Server-side auth helper
import { getAuthState } from "@/shared/auth/get-auth-state";
import { redirect } from "next/navigation";

export default async function SomePage() {
  const authState = await getAuthState();

  if (!authState.authenticated) {
    redirect("/login");
  }

  // ... rest of page
}
```

**Why not redirect in proxy?**
- Avoids caching/timing issues with session data
- More predictable flow (redirects happen in pages, not middleware layer)
- Easier to debug and maintain

**Image handling**: Always use `<Image>` from `next/image`, not `<img>`

**Forms**: Use server actions for form submissions (see `src/features/auth/api/`)

## Features Structure

```
src/features/
├── auth/
│   ├── api/           # Server actions
│   ├── components/    # Auth UI components
│   ├── constants/     # Constants
│   ├── types/         # TypeScript types
│   └── index.ts       # Public exports
└── onboarding/
    ├── api/           # complete-onboarding.ts server action
    ├── components/    # Wizard steps (StepBasicInfo, StepSkills, StepIdealRole)
    ├── hooks/         # useOnboardingForm, useTechnologies
    ├── schemas/       # Zod validation schemas
    ├── constants/     # Form defaults, validation rules, wizard config
    ├── types/         # TypeScript interfaces
    └── index.ts       # Public exports
```

This pattern keeps related code together. When adding new features, follow this structure.

**Utility functions**: Business logic extracted to feature-specific `utils/` folders following "components presentation-only" principle
- Filter logic: `filter-jobs.ts`
- Display formatting: `job-display.ts` (formatSalaryDisplay, calculateMatchPercentage)
- Badge mapping: `badge-variants.ts` (getWorkplaceBadgeVariant, getExperienceBadgeVariant)

**Null safety pattern**: Handle nullable fields (currency, URLs) in utility functions, not in components

**Form management**: All features with forms follow the react-hook-form + Zod resolver pattern with logic extracted to custom hooks. See root CLAUDE.md for pattern details.

## Environment Setup

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Environment variables are validated automatically by `@codeforge-v2/database` package on import.

## Shared Components

**Component location**: App-specific shared components go in `/apps/web/src/shared/components/ui/`, NOT in `/packages/ui/`. Package components are for cross-app reuse only.

**Reusable UI components** (`src/shared/components/ui/`):
- `page-header.tsx` - Page title/description with optional action slot
- `colored-section-card.tsx` - Section card with color accent and gradient (uses design tokens)
- `status-badge.tsx` - Status→badge variant mapping
- `company-avatar.tsx` - Company logo with fallback initials
- `match-score-indicator.tsx` - Visual score display with color coding
- `error-display.tsx` - Standardized error UI (centered or inline)

**Design tokens**: Color mappings centralized in `src/shared/lib/design-tokens.ts` (SECTION_COLORS, MATCH_SCORE_COLORS)

**Badge variants**: Extended Badge component supports semantic variants: success, warning, info, remote, hybrid, office

Uses shadcn/ui components from `@codeforge-v2/ui`:

```typescript
import { Button } from "@codeforge-v2/ui/components/button";
import { Card } from "@codeforge-v2/ui/components/ui/card";
import { Input } from "@codeforge-v2/ui/components/ui/input";
import { Select } from "@codeforge-v2/ui/components/ui/select";
import { Combobox } from "@codeforge-v2/ui/components/ui/combobox";
```

Components use Radix UI primitives with Tailwind styling.

**Reusable infrastructure**:
- `src/shared/components/wizard/` - Multi-step form wizard with validation and progress tracking

## AI/ML Integration

This project uses **local AI models** for embeddings and text processing, NOT external APIs like OpenAI.

**Preferred approach**:
- Use `@xenova/transformers` (transformers.js) for local inference
- Model: `all-MiniLM-L6-v2` (384-dimensional embeddings)
- Benefits: Privacy, no API costs, offline capability

**When to use OpenAI**: Only if explicitly requested or local models insufficient for specific use case.

See Milestone 2.5 in `tasks.md` for embeddings infrastructure implementation.

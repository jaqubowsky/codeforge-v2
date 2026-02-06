# Codeforge-v2 - Project Overview

## Purpose
Job offer scraping and display platform. Scrapes job listings from multiple boards, matches them to user profiles using AI embeddings, and displays them in a dashboard.

## Tech Stack
- **Monorepo**: pnpm workspaces + Turborepo
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend/Serverless**: Google Cloud Functions (scraper app)
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **AI/ML**: transformers.js (bi-encoder embeddings + cross-encoder re-ranking)
- **UI**: shadcn/ui (Radix primitives), Tailwind CSS
- **Forms**: react-hook-form + Zod
- **Linting/Formatting**: Biome via Ultracite
- **Package Manager**: pnpm 10.28.2
- **Build**: Turborepo

## Monorepo Structure
```
apps/
├── web/              # Next.js 16 frontend
└── scraper/          # Google Cloud Functions serverless scraper

packages/
├── database/         # Supabase client, queries, generated types
├── embeddings/       # AI embeddings + cross-encoder re-ranking (transformers.js)
├── scraper/          # Core scraping logic (strategy pattern)
├── ui/               # Shared shadcn/ui components
└── typescript-config/# Shared tsconfig presets
```

## Web App Features
- `features/auth/` - Login, signup (Supabase Auth)
- `features/dashboard/` - Job listings, filtering, sorting, matching
- `features/profile/` - User profile management
- `features/onboarding/` - Post-registration profile setup
- `features/landing/` - Public landing page

## Route Groups (Next.js App Router)
- `(app)` - Authenticated + onboarded routes (sidebar layout)
- `(auth)` - Public auth pages (redirects if authenticated)
- `onboarding` - Requires auth but NOT onboarding completion
- `api/auth/callback` - OAuth callback handler

## Authentication
- Supabase Auth (email/password + OAuth)
- `createAuthenticatedClient()` for server actions
- `AuthRedirect` component for route protection
- `getAuthState()` for server-side auth checks
- `useAuthState()` hook for client-side reactive auth

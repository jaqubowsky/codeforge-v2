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
├── ui/               # Shared shadcn/ui components (Radix primitives)
└── typescript-config/# Shared tsconfig presets (base, nextjs, react-library)
```

**Data flow**: Scraper fetches job offers from boards (e.g., JustJoinIT) using Playwright, validates with Zod schemas, stores in Supabase. Web app displays data.

**Key patterns in scraper**:
- Strategy pattern for different job boards (`apps/scraper/src/strategies/`)
- Service layer for orchestration (`apps/scraper/src/services/`)
- Zod schemas for all external data (`apps/scraper/src/schemas/`)

## Development Commands

```bash
npm run dev           # Start all apps (web on port 3001)
npm run dev:web       # Web app only
npm run build         # Production build all
npm run check-types   # TypeScript validation
npm run fix           # Auto-fix with Ultracite/Biome

# Scraper
npm run dev:getOffersByTechnology  # Run scraper function locally
```

## Code Quality

This project uses **Ultracite** (Biome-based) with pre-commit hooks. Code is auto-formatted on commit via Husky + lint-staged.

**Quick reference**:
- `npm run fix` - Format and fix code
- `npm run check` - Check without fixing

## Environment Variables

**Database package** (required for both apps):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY` (scraper only)

## Package Imports

```typescript
// UI components
import { Button } from "@codeforge-v2/ui/components/button";
import { cn } from "@codeforge-v2/ui/lib/utils";

// Database
import { client, adminClient } from "@codeforge-v2/database";
```

---

# Ultracite Code Standards

This project enforces strict code quality through Ultracite/Biome. Most issues are auto-fixable.

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**.

### TypeScript

- Prefer `unknown` over `any`
- Use `as const` for immutable values
- Use `import type` and `export type` for types
- No enums—use const objects or union types
- No non-null assertions (`!`)

### Modern JS/TS

- Arrow functions for callbacks
- `for...of` over `.forEach()`
- Optional chaining (`?.`) and nullish coalescing (`??`)
- Template literals over concatenation
- `const` by default, `let` when needed, never `var`

### React & JSX

- Function components only
- Hooks at top level, never conditional
- Complete dependency arrays
- Unique `key` props (not array indices)
- Children nested, not as props
- No components defined inside components

### Accessibility

- Meaningful alt text for images
- `<button type="button">` or `type="submit"`
- Keyboard handlers alongside mouse handlers
- Semantic elements over ARIA roles
- `rel="noopener"` with `target="_blank"`

### Next.js

- `<Image>` component, not `<img>`
- App Router metadata API for head elements
- Server Components for async data fetching

### Async

- Always await promises in async functions
- `async/await` over promise chains
- No async Promise executors

### Style

- No `console.log` or `debugger` in production
- Throw `Error` objects with messages
- Early returns over nested conditionals
- No nested ternaries

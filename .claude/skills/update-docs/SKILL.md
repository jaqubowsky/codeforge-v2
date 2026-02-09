---
name: update-docs
description: Keep project documentation fresh after codebase changes. Use PROACTIVELY at the END of any implementation task that changes the codebase, specifically after (1) database migrations or schema changes — add/drop columns, tables, enums, functions, (2) changing package exports or public APIs, (3) adding/removing/renaming features, components, or routes, (4) modifying scraping strategies or adding job boards, (5) changing environment variables or configuration, (6) any structural change that could make existing CLAUDE.md or MEMORY.md docs stale. Trigger AFTER code changes are complete but BEFORE committing.
---

# Update Docs

Scan and update all project documentation after codebase changes to prevent staleness.

## Checklist

### 1. Database Schema Changes

If any migration was applied:

- Regenerate types: `pnpm generate-api-types` from `packages/database/` (NEVER manually edit `database.types.ts`)
- Update `packages/database/CLAUDE.md` — table descriptions, enum lists, RPC function signatures
- Grep all `**/*.md` files for references to dropped/renamed columns, tables, or enums

### 2. Feature/Component/Route Changes

If features, components, or routes were added/removed/renamed:

- Update `apps/web/CLAUDE.md` — route structure, co-location examples
- Update `packages/scraper/CLAUDE.md` if scraping strategies changed

### 3. Package API Changes

If package exports or public APIs changed:

- Update the relevant `packages/*/CLAUDE.md` — exports, usage examples

### 4. Scan for Stale References

Search for removed identifiers across all markdown docs:

```
Grep for removed function/type/column/component names across **/*.md
```

Fix or remove any stale references found.

### 5. Update MEMORY.md

If the change introduced a new pattern, convention, or lesson learned:

- Add to the appropriate section in MEMORY.md
- Keep under 200 lines (content after line 200 is truncated in system prompt)

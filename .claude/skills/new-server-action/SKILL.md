---
name: new-server-action
description: Scaffold a new server action with optional mapper and types. Use when (1) user says /new-server-action, "create server action", "add server action", "new action", "scaffold action", (2) adding a new API endpoint to a feature, (3) creating a new data-fetching or mutation function for a feature. Generates files following the project's Result type, type decoupling, and mapper patterns.
---

# New Server Action

Scaffold server actions following project conventions. See [references/templates.md](references/templates.md) for all templates.

## Workflow

1. **Determine scope** from user request:
   - Feature name (e.g., `dashboard`, `profile`, `bookmarks`)
   - Action name in kebab-case (e.g., `get-bookmarks`, `delete-bookmark`)
   - Whether it's a query (read) or mutation (write)
   - Whether complex DB joins require a mapper

2. **Create files** based on scope:

| Scenario | Files to create |
|----------|----------------|
| Simple query/mutation (no joins) | `api/ACTION_NAME.ts` only |
| Query with joins/transforms | `api/ACTION_NAME.ts` + `api/mappers/FEATURE.ts` (if mapper doesn't exist) |
| New feature | `api/ACTION_NAME.ts` + `types/FEATURE.ts` + `api/mappers/FEATURE.ts` |

3. **File locations**: All under `apps/web/src/features/FEATURE_NAME/`

## Rules

- Every action file starts with `"use server";`
- Every action returns `Promise<Result<T>>` using `ok()`/`err()` from `@/shared/api`
- Every authenticated action calls `createAuthenticatedClient()` and early-returns on failure
- Mutations call `revalidatePath()` after success
- Types in `types/FEATURE.ts` have NO database imports
- Mappers in `api/mappers/FEATURE.ts` are the ONLY place for `@codeforge-v2/database` imports
- Use `Pick<DatabaseRow, "field1" | "field2">` for DTOs in mappers
- One exported action per file, file named after the action in kebab-case
- Use named types from DB enums, not inline string literal unions

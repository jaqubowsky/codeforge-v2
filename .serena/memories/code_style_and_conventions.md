# Code Style & Conventions

## Formatting (Biome)
- Indent: spaces (not tabs)
- Quotes: double quotes
- File naming: kebab-case (enforced by linter)
- Auto-organized imports

## Linting Rules (Key)
- No `console.log` or `debugger` in production
- No code comments (self-documenting code)
- Prefer `unknown` over `any`
- Use `import type` for type-only imports
- No enums — use const objects or union types
- No unused imports (auto-fixed)
- No inferrable types
- No useless else (use early returns)
- Unused catch variables: prefix with `_` (e.g. `_error`)

## Type Safety
- Avoid `as` type assertions — use Zod `.parse()`, typed variables, or explicit return types
- `as` only acceptable at external API boundaries
- Use named DB enum types (e.g. `EmploymentType`) not inline string literals
- Typed variables for literals: `const period: SalaryPeriod = "month"`
- Explicit return type annotations to narrow literals in `.map()`

## File Naming
- `index.ts` = barrel exports ONLY (never logic/definitions)
- Named files for logic: `dashboard.ts`, `filter-options.ts`
- Import from named files, not barrel indexes

## Co-location Pattern
- Component-specific hooks/utils → co-located in wrapper folder
- Shared hooks/utils → feature-level folders
- Single-use types → inline in the consuming file
- Multi-use types → feature-level `types/` folder

## Architecture
- Features cannot import from other features (isolation)
- Extract ALL business logic to custom hooks
- Components are presentation-only (JSX + props)
- Extract constants to UPPER_CASE variables
- No nested ternaries — use helper functions
- Early returns with curly braces

## API Pattern
- Server actions return `Result<T>` using `ok()` / `err()`
- `createAuthenticatedClient()` for auth-required actions
- Database types decoupled from app types via mappers
- Only `api/mappers/` files import database types

---
name: feature-consistency
description: Ensures feature structure consistency and co-location patterns in the web app. Use when (1) creating new features like auth, bookmarks, notifications, (2) editing existing features - adding/modifying components, hooks, utils, types, or schemas, (3) reviewing feature structure for compliance, (4) refactoring to co-locate component-specific logic, (5) adding new components with hooks or utilities. Examples of user requests that should trigger this skill include "add a new feature", "create component with hook", "add form to dashboard", "refactor profile feature", "check feature structure".
---

# Feature Consistency

When working with features (new or existing), ensure the structure follows these patterns:

## Directory Structure

```
features/[feature-name]/
├── api/
│   ├── mappers/
│   │   └── [feature-name].ts     # DB→app type mappers (only place for @codeforge-v2/database imports)
│   └── actions.ts                 # Server actions with "use server" each one in separate file
├── components/
│   ├── simple-component.tsx       # Simple components - no wrapper needed
│   └── complex-component/         # Components with specific hooks/utils
│       ├── index.ts               # Barrel: export { ComplexComponent } from "./complex-component"
│       ├── complex-component.tsx  # The component itself
│       ├── use-[hook].ts          # Component-specific hook (CO-LOCATED)
│       └── [util].ts              # Component-specific util (CO-LOCATED)
├── constants/
│   └── [feature-name].ts          # Feature-wide constants
├── schemas/
│   └── [feature-name].ts          # Feature-wide Zod schemas
├── types/
│   └── [feature-name].ts          # Feature-wide types (NO database imports!)
└── index.ts                       # Barrel exports ONLY
```

## Key Rules

### File Naming
- **`index.ts` = barrel exports ONLY** - never put logic/definitions in index.ts
- Files with logic get descriptive names: `dashboard.ts`, `filter-options.ts`
- Import from named files: `from "../types/dashboard"` not `from "../types"`

### Co-location Pattern (CRITICAL)
**When a hook/util is used by ONLY ONE component:**
- Create a wrapper folder for the component
- Move the hook/util INTO the component's folder
- Update imports to use `./` for co-located files

**When a hook/util is used by 2+ components:**
- Keep it in feature-level `hooks/` or `utils/` folder

### Type Decoupling
- `types/` - App types only, NO database imports
- `api/mappers/` - ONLY place to import from `@codeforge-v2/database`

### API Pattern
```typescript
import { ok, err, type Result } from "@/shared/api";

export async function myAction(): Promise<Result<MyData>> {
  if (error) return err("Error message");
  return ok(data);
}
```

## Checklist When Modifying Features

1. **Adding a component with a hook/util?**
   - [ ] Create wrapper folder: `components/[name]/`
   - [ ] Add `index.ts` barrel export
   - [ ] Put hook/util IN the component folder
   - [ ] Use `./` imports for co-located files

2. **Adding a hook/util used by multiple components?**
   - [ ] Put in feature-level `hooks/` or `utils/` folder

3. **Adding types?**
   - [ ] Put in `types/[feature].ts` (named file, not index.ts)
   - [ ] NO database imports in type files

4. **Adding schemas?**
   - [ ] Put in `schemas/[feature].ts` (named file, not index.ts)

5. **Adding server actions?**
   - [ ] Put in `api/` folder with `"use server"` directive
   - [ ] Use `ok()`/`err()` pattern from `@/shared/api`

## Quick Audit

To check if a feature follows the pattern:
```bash
# Check for index.ts files with logic (should only have exports)
grep -r "function\|const\|type\|interface" apps/web/src/features/[name]/*/index.ts

# Check for hooks/utils not co-located
ls apps/web/src/features/[name]/hooks/
ls apps/web/src/features/[name]/utils/
# These should be empty if all hooks/utils are co-located with their components
```

## Example Refactoring

**Before** (wrong):
```
feature/
├── components/
│   └── my-form.tsx
├── hooks/
│   └── use-my-form.ts    # Only used by my-form.tsx - SHOULD BE CO-LOCATED
└── types/
    └── index.ts          # Has type definitions - SHOULD BE NAMED FILE
```

**After** (correct):
```
feature/
├── components/
│   └── my-form/
│       ├── index.ts           # export { MyForm } from "./my-form"
│       ├── my-form.tsx
│       └── use-my-form.ts     # CO-LOCATED with its component
└── types/
    └── feature.ts             # Named file, not index.ts
```

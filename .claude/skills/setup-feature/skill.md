---
name: setup-feature
description: Scaffolds a new feature in the web app following the project's feature structure pattern. Use when adding new features like auth, bookmarks, notifications, etc.
---

When setting up a new feature:

1. **Ask for feature name**:
   - Prompt user for feature name in kebab-case
   - Examples: "job-bookmarks", "notifications", "user-settings"

2. **Create directory structure** in `apps/web/src/features/[feature-name]/`:
   ```
   [feature-name]/
   ├── api/
   │   └── actions.ts
   ├── components/
   │   └── [feature-name]-example.tsx
   ├── constants/
   │   └── index.ts
   ├── types/
   │   └── index.ts
   └── index.ts
   ```

3. **Generate boilerplate files**:

### api/actions.ts
```typescript
"use server";

import { client } from "@codeforge-v2/database";

// Example server action - replace with your logic
export async function exampleAction(data: unknown) {
  try {
    // Add your server-side logic here
    const result = await client.from("table_name").select("*");

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error in exampleAction:", error);
    return { success: false, error: "An error occurred" };
  }
}
```

### components/[feature-name]-example.tsx
```typescript
"use client";

import { Button } from "@codeforge-v2/ui/components/button";

export function [FeatureName]Example() {
  return (
    <div>
      <h2>[Feature Name] Component</h2>
      <Button>Example Button</Button>
    </div>
  );
}
```

### constants/index.ts
```typescript
// Add feature-specific constants here
export const EXAMPLE_CONSTANT = "value";
```

### types/index.ts
```typescript
// Add feature-specific types here
export interface ExampleType {
  id: string;
  name: string;
}
```

### index.ts (barrel export)
```typescript
// Export components
export { [FeatureName]Example } from "./components/[feature-name]-example";

// Export server actions
export { exampleAction } from "./api/actions";

// Export types
export type { ExampleType } from "./types";

// Export constants
export { EXAMPLE_CONSTANT } from "./constants";
```

4. **Remind about conventions**:
   - `api/` - Server actions only (use `"use server"` directive)
   - `components/` - React components (add `"use client"` if interactive)
   - Components: PascalCase, files: kebab-case
   - Import from `@codeforge-v2/ui` for shared components
   - Import from `@codeforge-v2/database` for DB operations

5. **Output success message**:
   ```
   ✓ Created feature: apps/web/src/features/[feature-name]/

   Files created:
   - api/actions.ts
   - components/[feature-name]-example.tsx
   - constants/index.ts
   - types/index.ts
   - index.ts

   Next steps:
   1. Replace example code with your feature logic
   2. Add feature-specific types in types/index.ts
   3. Create additional components as needed
   4. Export public API through index.ts
   ```

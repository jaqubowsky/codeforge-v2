# Example: Setting Up Job Bookmarks Feature

## User Request
```
User: /setup-feature
```

## Claude Response
```
What feature would you like to create? (kebab-case)
```

## User Input
```
User: job-bookmarks
```

## Claude Output
```
✓ Created feature: apps/web/src/features/job-bookmarks/

Files created:
- api/actions.ts (server actions for bookmark operations)
- components/job-bookmarks-example.tsx (example component)
- constants/index.ts (feature constants)
- types/index.ts (TypeScript types)
- index.ts (barrel export)

Next steps:
1. Replace example code with your feature logic
2. Add feature-specific types in types/index.ts
3. Create additional components as needed
4. Export public API through index.ts

Feature structure conventions:
- api/ - Server actions only (use "use server" directive)
- components/ - React components (add "use client" if interactive)
- Components: PascalCase, files: kebab-case
- Import from @codeforge-v2/ui for shared components
- Import from @codeforge-v2/database for DB operations
```

## Generated Files

### apps/web/src/features/job-bookmarks/api/actions.ts
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

### apps/web/src/features/job-bookmarks/components/job-bookmarks-example.tsx
```typescript
"use client";

import { Button } from "@codeforge-v2/ui/components/button";

export function JobBookmarksExample() {
  return (
    <div>
      <h2>Job Bookmarks Component</h2>
      <Button>Example Button</Button>
    </div>
  );
}
```

### apps/web/src/features/job-bookmarks/constants/index.ts
```typescript
// Add feature-specific constants here
export const EXAMPLE_CONSTANT = "value";
```

### apps/web/src/features/job-bookmarks/types/index.ts
```typescript
// Add feature-specific types here
export interface ExampleType {
  id: string;
  name: string;
}
```

### apps/web/src/features/job-bookmarks/index.ts
```typescript
// Export components
export { JobBookmarksExample } from "./components/job-bookmarks-example";

// Export server actions
export { exampleAction } from "./api/actions";

// Export types
export type { ExampleType } from "./types";

// Export constants
export { EXAMPLE_CONSTANT } from "./constants";
```

## What to Do Next

Replace the example code with actual bookmark functionality:

1. **Update types/index.ts**:
   ```typescript
   export interface JobBookmark {
     id: string;
     userId: string;
     jobOfferId: string;
     createdAt: string;
   }
   ```

2. **Update api/actions.ts** with real actions:
   ```typescript
   export async function addBookmark(jobOfferId: string) { ... }
   export async function removeBookmark(bookmarkId: string) { ... }
   export async function getUserBookmarks() { ... }
   ```

3. **Create real components** in components/:
   - `bookmark-button.tsx` - Toggle bookmark on/off
   - `bookmarks-list.tsx` - Display user's bookmarks
   - etc.

4. **Update index.ts** to export the real API

# Web App (Next.js 16 / React 19)

## Architecture Conventions

- Extract ALL business logic to custom hooks
- Keep components presentation-only (JSX + props)
- Extract constants to UPPER_CASE variables
- No nested ternary expressions—use helper functions with if/else
- Early returns with curly braces for block statements
- Features cannot import from other features (maintain isolation)
- Single-use constants belong close to usage, not in centralized constants file

## Co-location Pattern

```
components/
├── simple-component.tsx           # Simple component - no wrapper folder needed
└── complex-component/             # Component with specific hooks/utils
    ├── index.ts                   # Barrel export: export { ComplexComponent } from "./complex-component"
    ├── complex-component.tsx      # The component itself
    ├── use-complex-hook.ts        # Component-specific hook (co-located)
    └── complex-utils.ts           # Component-specific utils (co-located)
```

**When to co-locate**:
- Hook/util/schema/constant used by ONE component → separate file IN that component's wrapper folder
- Hook/util/schema/constant used by 2+ components → feature-level `hooks/`, `utils/`, `schemas/`, or `constants/` folder
- Types/interfaces used by ONE file → inline directly into that file (no separate types file)
- Types/interfaces used by 2+ files → feature-level `types/` folder

## Route Structure

```
src/app/
├── (app)/                    # Authenticated routes with sidebar layout
│   ├── layout.tsx            # Auth check (requires onboarding), sidebar, navigation
│   ├── dashboard/page.tsx    # /dashboard - main job listings
│   └── profile/page.tsx      # /profile - user profile settings
├── (auth)/                   # Public auth pages (redirects away if authenticated)
│   ├── layout.tsx            # Auth check (redirects to /dashboard if logged in)
│   ├── login/page.tsx        # /login
│   └── signup/page.tsx       # /signup
├── api/auth/callback/route.ts # /api/auth/callback - OAuth callback handler
├── onboarding/page.tsx       # /onboarding - post-auth profile setup
├── layout.tsx                # Root layout (providers, fonts)
└── page.tsx                  # / - landing page
```

**Route groups**:
- `(app)` - Authenticated + onboarding completed. Has sidebar layout.
- `(auth)` - Public pages. Redirects to dashboard if already authenticated.
- `onboarding` - Authenticated but onboarding NOT completed. Separate from both groups.

**Why onboarding is outside both groups**:
- Can't be in `(app)` - would cause redirect loop (app requires onboarding → redirects to onboarding)
- Can't be in `(auth)` - requires authentication (auth pages redirect authenticated users away)

## Form Management

Uses **react-hook-form** with **Zod resolver** for all forms.

```typescript
// schemas/[feature-name].ts - Define schema with Zod
export const myFormSchema = z.object({
  field: z.string().min(1, "Required"),
});
export type MyFormData = z.infer<typeof myFormSchema>;

// components/my-form/use-my-form.ts - Extract all form logic to custom hook (co-located)
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

// components/my-form/my-form.tsx - Presentation only with Controller
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

## API Response Pattern

Server actions return discriminated unions for type-safe error handling:

```typescript
import { ok, err, type Result } from "@/shared/api";

export async function myAction(): Promise<Result<MyData>> {
  if (error) return err("Error message");
  return ok(data);
}

// Consumer - TypeScript narrows type after success check
const result = await myAction();
if (!result.success) {
  toast.error(result.error); // error is string
  return;
}
console.log(result.data); // data is MyData
```

## Authenticated Server Actions

All server actions that require authentication use `createAuthenticatedClient()` from `@/shared/supabase/server`:

```typescript
import { createAuthenticatedClient } from "@/shared/supabase/server";

export async function myAction(): Promise<Result<MyData>> {
  const authResult = await createAuthenticatedClient();
  if (!authResult.success) {
    return authResult;
  }
  const { supabase, userId } = authResult.data;

  // use supabase and userId...
}
```

Returns `Result<{ supabase, userId }>`. Use `createClient()` only when authentication is not required.

## Database Type Decoupling

App types are standalone (no database imports). Mappers convert database types to app types.

```
features/example/
├── types/
│   └── example.ts        # App types (NO database imports) - named file, not index.ts
├── api/
│   ├── mappers/
│   │   └── example.ts    # Import Database types here, export mappers
│   └── my-action.ts      # Uses mapper, returns Result<AppType>
└── index.ts              # Barrel exports ONLY
```

**Type rules**:
- App types (`types/`) must NOT import from `@codeforge-v2/database`
- Only mappers (`api/mappers/`) import database types
- Use `Pick<DatabaseRow, "field1" | "field2">` for DTOs in mappers

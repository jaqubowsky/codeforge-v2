# Server Action Templates

## Simple Action (query, no mapper needed)

```typescript
"use server";

import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createAuthenticatedClient } from "@/shared/supabase/server";

export async function ACTION_NAME(): Promise<Result<RETURN_TYPE>> {
  const authResult = await createAuthenticatedClient();
  if (!authResult.success) {
    return authResult;
  }
  const { supabase, userId } = authResult.data;

  const { data, error } = await supabase
    .from("TABLE_NAME")
    .select("COLUMNS")
    .eq("user_id", userId);

  if (error) {
    return err(error.message);
  }

  return ok(data);
}
```

## Mutation Action (with revalidation)

```typescript
"use server";

import { revalidatePath } from "next/cache";
import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createAuthenticatedClient } from "@/shared/supabase/server";

export async function ACTION_NAME(
  PARAMS
): Promise<Result<void>> {
  const authResult = await createAuthenticatedClient();
  if (!authResult.success) {
    return authResult;
  }
  const { supabase, userId } = authResult.data;

  const { error } = await supabase
    .from("TABLE_NAME")
    .update({ FIELDS })
    .eq("user_id", userId);

  if (error) {
    return err(error.message);
  }

  revalidatePath("/ROUTE");

  return ok(undefined);
}
```

## Query Action (with mapper)

```typescript
"use server";

import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createAuthenticatedClient } from "@/shared/supabase/server";
import type { AppType } from "../types/FEATURE_NAME";
import { mapToAppType } from "./mappers/FEATURE_NAME";

export async function ACTION_NAME(): Promise<Result<AppType[]>> {
  const authResult = await createAuthenticatedClient();
  if (!authResult.success) {
    return authResult;
  }
  const { supabase, userId } = authResult.data;

  const { data, error } = await supabase
    .from("TABLE_NAME")
    .select("COLUMNS, JOINS")
    .eq("user_id", userId);

  if (error) {
    return err(error.message);
  }

  return ok(data.map(mapToAppType).filter(Boolean));
}
```

## Mapper File Template

Path: `api/mappers/FEATURE_NAME.ts`

```typescript
import type { Database } from "@codeforge-v2/database";
import type { AppType } from "../../types/FEATURE_NAME";

type TableRow = Database["public"]["Tables"]["TABLE_NAME"]["Row"];

type DTO = Pick<TableRow, "field1" | "field2" | "field3">;

export function mapToAppType(dto: DTO): AppType {
  return {
    fieldOne: dto.field1,
    fieldTwo: dto.field2,
    fieldThree: dto.field3,
  };
}
```

## App Types File Template

Path: `types/FEATURE_NAME.ts`

```typescript
// NO database imports here - only plain TypeScript types

export interface AppType {
  fieldOne: string;
  fieldTwo: number;
  fieldThree: string | null;
}
```

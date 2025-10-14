import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { env } from "./env";

export const client = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
export const adminClient = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_KEY
);

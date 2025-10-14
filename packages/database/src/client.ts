import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export const client = createClient<Database>(supabaseUrl, supabaseAnonKey);
export const adminClient = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey
);

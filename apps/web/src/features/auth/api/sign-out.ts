import { createClient } from "@/shared/supabase/client";

export async function signOut() {
  const supabase = createClient();
  return await supabase.auth.signOut();
}

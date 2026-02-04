"use server";

import { createClient } from "@/shared/supabase/server";

export async function getTechnologies() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("technologies")
    .select("id, name")
    .order("name");

  if (error) {
    return { success: false, data: [], error: error.message };
  }

  return { success: true, data: data || [], error: null };
}

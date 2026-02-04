import { createClient } from "@/shared/supabase/client";

export async function completeOnboarding(userId: string) {
  const supabase = createClient();
  return await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", userId);
}

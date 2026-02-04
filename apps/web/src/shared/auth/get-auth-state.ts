import type { User } from "@supabase/supabase-js";
import { createClient } from "@/shared/supabase/server";

export type AuthState =
  | { authenticated: false; user: null; onboardingCompleted: false }
  | {
      authenticated: true;
      user: User;
      onboardingCompleted: boolean;
    };

export async function getAuthState(): Promise<AuthState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { authenticated: false, user: null, onboardingCompleted: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  return {
    authenticated: true,
    user,
    onboardingCompleted: profile?.onboarding_completed ?? false,
  };
}

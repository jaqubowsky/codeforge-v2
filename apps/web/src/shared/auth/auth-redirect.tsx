import { redirect } from "next/navigation";
import { getAuthState } from "./get-auth-state";

interface AuthRedirectProps {
  requireAuth?: boolean;
  requireOnboarding?: boolean;
  redirectTo?: string;
}

export async function AuthRedirect({
  requireAuth = false,
  requireOnboarding = false,
  redirectTo = "/",
}: AuthRedirectProps) {
  const authState = await getAuthState();

  if (requireAuth && !authState.authenticated) {
    redirect("/login" as never);
  }

  if (!requireAuth && authState.authenticated) {
    redirect(redirectTo as never);
  }

  if (requireOnboarding && !authState.onboardingCompleted) {
    redirect("/onboarding" as never);
  }

  if (!requireOnboarding && authState.onboardingCompleted) {
    redirect(redirectTo as never);
  }

  return null;
}

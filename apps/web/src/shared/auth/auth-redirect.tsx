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
    redirect("/login");
  }

  if (!requireAuth && authState.authenticated) {
    redirect(redirectTo);
  }

  if (requireOnboarding && !authState.onboardingCompleted) {
    redirect("/onboarding");
  }

  if (!requireOnboarding && authState.onboardingCompleted) {
    redirect(redirectTo);
  }

  return null;
}

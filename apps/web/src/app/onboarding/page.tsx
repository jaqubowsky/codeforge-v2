import { Suspense } from "react";
import { OnboardingWizard } from "@/features/onboarding";
import { AuthRedirect } from "@/shared/auth/auth-redirect";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Suspense fallback={null}>
        <AuthRedirect redirectTo="/" requireAuth requireOnboarding={false} />
      </Suspense>

      <div className="flex flex-1 flex-col">
        <header className="border-border/60 border-b bg-card/80 px-4 py-4 backdrop-blur-sm">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="font-semibold text-foreground text-xl tracking-tight">
              Complete Your Profile
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">
              Help us match you with the perfect job opportunities
            </p>
          </div>
        </header>

        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
            <OnboardingWizard />
          </div>
        </main>
      </div>
    </div>
  );
}

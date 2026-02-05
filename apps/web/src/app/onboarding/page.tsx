import { Heading } from "@codeforge-v2/ui/components/heading";
import { Text } from "@codeforge-v2/ui/components/text";
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
        <header className="border-border/50 border-b bg-card/80 px-6 py-4 backdrop-blur-sm">
          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
              <span className="font-bold font-mono text-background text-xs">
                L
              </span>
            </div>
            <Heading level={3}>Complete Your Profile</Heading>
            <Text className="mt-1" variant="mono">
              Set up your preferences
            </Text>
          </div>
        </header>

        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="mx-auto w-full max-w-xl flex-1 px-6 py-6">
            <OnboardingWizard />
          </div>
        </main>
      </div>
    </div>
  );
}

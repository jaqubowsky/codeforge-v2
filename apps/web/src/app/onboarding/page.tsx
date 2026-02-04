import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@codeforge-v2/ui/components/card";
import { Suspense } from "react";
import { OnboardingWizard } from "@/features/onboarding";
import { AuthRedirect } from "@/shared/auth/auth-redirect";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={null}>
        <AuthRedirect redirectTo="/" requireAuth requireOnboarding={false} />
      </Suspense>

      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Help us match you with the perfect job opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingWizard />
        </CardContent>
      </Card>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@codeforge-v2/ui/components/card";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/features/onboarding";
import { getAuthState } from "@/shared/auth/get-auth-state";

export default async function OnboardingPage() {
  const authState = await getAuthState();

  if (!authState.authenticated) {
    redirect("/login");
  }

  if (authState.onboardingCompleted) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
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

import { redirect } from "next/navigation";
import { SignOutButton } from "@/features/auth";
import { getAuthState } from "@/shared/auth/get-auth-state";

export default async function Home() {
  const authState = await getAuthState();

  if (!authState.authenticated) {
    redirect("/login");
  }

  if (!authState.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Job Tracker</h1>
          <p className="text-muted-foreground">
            Manage your job applications in one place
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-8">
        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <h2 className="font-semibold text-lg">Welcome back!</h2>
          <p className="mt-2 text-muted-foreground">
            You are signed in as{" "}
            <span className="font-medium text-foreground">
              {authState.user.email}
            </span>
          </p>
          <p className="mt-4 text-muted-foreground text-sm">
            This is your dashboard. The job inbox and other features will be
            implemented in upcoming milestones.
          </p>
        </div>
      </div>
    </div>
  );
}

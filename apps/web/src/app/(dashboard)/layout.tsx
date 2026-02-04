import { redirect } from "next/navigation";
import { getAuthState } from "@/shared/auth/get-auth-state";
import { DashboardSidebar } from "@/shared/components/layout/dashboard-sidebar";
import { MobileSidebar } from "@/shared/components/layout/mobile-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authState = await getAuthState();

  if (!authState.authenticated) {
    redirect("/login");
  }

  if (!authState.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <div className="flex h-screen">
      <DashboardSidebar className="hidden lg:flex" />

      <MobileSidebar />

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

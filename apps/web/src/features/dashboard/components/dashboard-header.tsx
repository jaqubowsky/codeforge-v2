import { PageHeader } from "@/shared/components/ui/page-header";
import { ModeToggle } from "@/shared/ui/theme-toggle";

export function DashboardHeader() {
  return (
    <PageHeader
      action={<ModeToggle />}
      description="Manage your job applications in one place"
      title="Job Tracker"
    />
  );
}

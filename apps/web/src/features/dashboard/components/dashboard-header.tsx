import { ModeToggle } from "@/shared/ui/theme-toggle";

export function DashboardHeader() {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Job Tracker</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your job applications in one place
        </p>
      </div>
      <ModeToggle />
    </div>
  );
}

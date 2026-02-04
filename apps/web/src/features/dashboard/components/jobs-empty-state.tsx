import { Briefcase } from "lucide-react";

export function JobsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Briefcase className="mb-4 h-16 w-16 text-muted-foreground" />
      <h3 className="mb-2 font-semibold text-xl">No jobs yet</h3>
      <p className="max-w-md text-muted-foreground">
        Click "Run Now" to discover opportunities that match your profile!
      </p>
    </div>
  );
}

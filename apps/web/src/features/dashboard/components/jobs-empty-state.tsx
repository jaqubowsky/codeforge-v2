import { Briefcase } from "lucide-react";
import { EmptyState } from "@/shared/components/ui/empty-state";

export function JobsEmptyState() {
  return (
    <EmptyState
      description='Click "Run Now" to discover opportunities that match your profile!'
      icon={Briefcase}
      title="No jobs yet"
    />
  );
}

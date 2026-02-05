import { cn } from "@codeforge-v2/ui/lib/utils";
import { Briefcase } from "lucide-react";
import { GlassCard } from "@/shared/components/ui/glass-card";
import { RunNowButton } from "./run-now-button";

export function JobsEmptyState() {
  return (
    <GlassCard className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className={cn(
          "mb-6 flex h-20 w-20 items-center justify-center rounded-full",
          "bg-muted/50"
        )}
      >
        <Briefcase className="h-10 w-10 text-muted-foreground" />
      </div>

      <h3 className="mb-2 font-semibold text-xl">No jobs yet</h3>

      <p className="mb-8 max-w-md text-muted-foreground">
        Your job tracker is empty. Start by scanning for opportunities that
        match your profile.
      </p>

      <RunNowButton variant="hero" />
    </GlassCard>
  );
}

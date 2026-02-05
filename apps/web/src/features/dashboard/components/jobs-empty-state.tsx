import { GlassCard } from "@codeforge-v2/ui/components/glass-card";
import { Heading } from "@codeforge-v2/ui/components/heading";
import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { Briefcase } from "lucide-react";
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

      <Heading className="mb-2" level={3}>
        No jobs yet
      </Heading>

      <Text className="mb-8 max-w-md" variant="caption">
        Your job tracker is empty. Start by scanning for opportunities that
        match your profile.
      </Text>

      <RunNowButton variant="hero" />
    </GlassCard>
  );
}

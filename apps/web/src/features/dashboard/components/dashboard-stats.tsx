import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import type { StatusType } from "@/shared/components/ui/status-badge";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import type { MatchRunInfo } from "../types";
import { RunNowButton } from "./run-now-button";

const LAST_RUN_FALLBACK_TEXT = "Never";

interface DashboardStatsProps {
  lastRun: MatchRunInfo;
}

export function DashboardStats({ lastRun }: DashboardStatsProps) {
  const lastRunText = lastRun.lastRunAt
    ? formatDistanceToNow(new Date(lastRun.lastRunAt), { addSuffix: true })
    : LAST_RUN_FALLBACK_TEXT;

  let statusType: StatusType = "idle";

  if (lastRun.status === "running") {
    statusType = "running";
  } else if (lastRun.status === "failed") {
    statusType = "failed";
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-muted-foreground text-sm">
        <StatusBadge status={statusType} />
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          Last effective run: {lastRunText}
        </span>
      </div>

      <RunNowButton />
    </div>
  );
}

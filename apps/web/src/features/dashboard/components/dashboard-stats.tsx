import { formatDistanceToNow } from "date-fns";
import { Briefcase, Clock } from "lucide-react";
import type { StatusType } from "@/shared/components/ui/status-badge";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import type { MatchRunInfo } from "../types";
import { RunNowButton } from "./run-now-button";

const LAST_RUN_FALLBACK_TEXT = "Never";

interface DashboardStatsProps {
  lastRun: MatchRunInfo;
  jobCount: number;
}

export function DashboardStats({ lastRun, jobCount }: DashboardStatsProps) {
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 text-muted-foreground text-sm">
        <div className="flex items-center gap-2">
          <StatusBadge status={statusType} />
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Last run: {lastRunText}
          </span>
        </div>

        <span className="flex items-center gap-1">
          <Briefcase className="h-4 w-4" />
          {jobCount} jobs
        </span>
      </div>

      <RunNowButton />
    </div>
  );
}

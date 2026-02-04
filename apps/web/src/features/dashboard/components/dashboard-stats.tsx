import { Badge } from "@codeforge-v2/ui/components/badge";
import { formatDistanceToNow } from "date-fns";
import { Briefcase, Clock } from "lucide-react";
import type { MatchRunInfo } from "../types";
import { RunNowButton } from "./run-now-button";

const LAST_RUN_FALLBACK_TEXT = "Never";

const RUN_STATUS = {
  RUNNING: "running",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

const RUN_STATUS_LABELS = {
  RUNNING: "Scraping Active",
  IDLE: "Idle",
} as const;

interface DashboardStatsProps {
  lastRun: MatchRunInfo;
  jobCount: number;
}

export function DashboardStats({ lastRun, jobCount }: DashboardStatsProps) {
  const lastRunText = lastRun.lastRunAt
    ? formatDistanceToNow(new Date(lastRun.lastRunAt), { addSuffix: true })
    : LAST_RUN_FALLBACK_TEXT;

  let statusVariant: "default" | "destructive" | "secondary" = "secondary";

  if (lastRun.status === RUN_STATUS.RUNNING) {
    statusVariant = "default";
  } else if (lastRun.status === RUN_STATUS.FAILED) {
    statusVariant = "destructive";
  }

  const statusLabel =
    lastRun.status === RUN_STATUS.RUNNING
      ? RUN_STATUS_LABELS.RUNNING
      : RUN_STATUS_LABELS.IDLE;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 text-muted-foreground text-sm">
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant}>{statusLabel}</Badge>
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

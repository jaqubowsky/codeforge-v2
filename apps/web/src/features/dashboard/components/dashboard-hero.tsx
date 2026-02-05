"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PageHero, PageHeroHeader } from "@/shared/components/ui/page-hero";
import { StatCard } from "@/shared/components/ui/stat-card";
import { StatusIndicator } from "@/shared/components/ui/status-indicator";
import type { MatchRunInfo, UserOfferStatus } from "../types";
import { RunNowButton } from "./run-now-button";

type StatusCounts = Record<UserOfferStatus | "all", number>;

interface DashboardHeroProps {
  lastRun: MatchRunInfo;
  totalJobs: number;
  newJobsCount: number;
  statusCounts: StatusCounts;
}

function getIndicatorStatus(runStatus: MatchRunInfo["status"]) {
  if (runStatus === "running") {
    return "active";
  }
  if (runStatus === "failed") {
    return "error";
  }
  return "idle";
}

export function DashboardHero({
  lastRun,
  totalJobs,
  newJobsCount,
  statusCounts,
}: DashboardHeroProps) {
  const lastRunText = lastRun.lastRunAt
    ? formatDistanceToNow(new Date(lastRun.lastRunAt), { addSuffix: true })
    : "Never";

  const appliedCount = statusCounts.applied || 0;
  const interviewingCount = statusCounts.interviewing || 0;

  return (
    <PageHero>
      <div className="space-y-8">
        <PageHeroHeader
          action={<RunNowButton />}
          description="Your AI-powered command center for job hunting. Track applications, discover matches, and land your dream role."
          statusIndicator={
            <StatusIndicator status={getIndicatorStatus(lastRun.status)} />
          }
          title="Job Tracker"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Briefcase className="h-3.5 w-3.5" />}
            label="Total Jobs"
            subtext={`Last scan ${lastRunText}`}
            value={totalJobs}
          />

          <StatCard
            icon={<Sparkles className="h-3.5 w-3.5" />}
            label="New Matches"
            subtext={newJobsCount > 0 ? "Ready to review" : "Scan for more"}
            value={newJobsCount}
          />

          <StatCard
            icon={<CheckCircle2 className="h-3.5 w-3.5" />}
            label="Applied"
            subtext={appliedCount > 0 ? "Applications sent" : "Start applying"}
            value={appliedCount}
          />

          <StatCard
            icon={<MessageSquare className="h-3.5 w-3.5" />}
            label="Interviewing"
            subtext={
              interviewingCount > 0 ? "In progress" : "Keep pushing forward"
            }
            value={interviewingCount}
          />
        </div>

        {lastRun.lastRunAt && lastRun.jobsFound > 0 && (
          <div
            className={cn(
              "flex items-center justify-center gap-6",
              "rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm",
              "p-4 text-center"
            )}
          >
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="h-4 w-4" />
              <span>Last scan: {lastRunText}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>
                Found{" "}
                <span className="font-medium text-foreground">
                  {lastRun.jobsFound}
                </span>{" "}
                jobs
                {lastRun.newJobsCount > 0 && (
                  <span className="text-success">
                    {" "}
                    ({lastRun.newJobsCount} new)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </PageHero>
  );
}

"use client";

import { formatDistanceToNow } from "date-fns";
import { Briefcase, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";
import { PageHero, PageHeroHeader } from "@/shared/components/ui/page-hero";
import { StatCard } from "@/shared/components/ui/stat-card";
import type { MatchRunInfo, UserOfferStatus } from "../types/dashboard";
import { RunNowButton } from "./run-now-button";

type StatusCounts = Record<UserOfferStatus | "all", number>;

interface DashboardHeroProps {
  lastRun: MatchRunInfo;
  totalJobs: number;
  newJobsCount: number;
  statusCounts: StatusCounts;
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
          sectionLabel="Dashboard"
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
      </div>
    </PageHero>
  );
}

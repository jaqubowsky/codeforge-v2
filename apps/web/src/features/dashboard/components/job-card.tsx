import { Badge } from "@codeforge-v2/ui/components/badge";
import { Button } from "@codeforge-v2/ui/components/button";
import { Card } from "@codeforge-v2/ui/components/card";
import { Progress } from "@codeforge-v2/ui/components/progress";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { ExternalLink, MapPin } from "lucide-react";
import Image from "next/image";
import { STATUS_OPTIONS } from "../constants";
import type { UserJobOffer } from "../types";
import { DeleteJobButton } from "./delete-job-button";
import { JobStatusDropdown } from "./job-status-dropdown";

interface JobCardProps {
  job: UserJobOffer;
}

const MAX_VISIBLE_TECHS = 2;

export function JobCard({ job }: JobCardProps) {
  const statusConfig = STATUS_OPTIONS.find((s) => s.value === job.status);

  const visibleTechs = job.technologies.slice(0, MAX_VISIBLE_TECHS);
  const remainingCount = Math.max(
    0,
    job.technologies.length - MAX_VISIBLE_TECHS
  );

  const salaryText =
    job.salaryFrom && job.salaryTo
      ? `${job.salaryFrom.toLocaleString()} - ${job.salaryTo.toLocaleString()} ${job.salaryCurrency}`
      : "Salary not disclosed";

  const matchPercentage = job.similarityScore
    ? Math.round(job.similarityScore * 100)
    : null;

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) {
      return "bg-green-500";
    }
    if (percentage >= 60) {
      return "bg-blue-500";
    }
    if (percentage >= 40) {
      return "bg-yellow-500";
    }
    return "bg-orange-500";
  };

  const getWorkplaceBadgeClass = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType === "remote") {
      return "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
    }
    if (lowerType === "hybrid") {
      return "bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-900";
    }
    return "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800";
  };

  const getExperienceBadgeClass = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes("senior")) {
      return "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900";
    }
    if (lowerLevel.includes("mid")) {
      return "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900";
    }
    return "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800";
  };

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col p-6",
        "transition-all duration-200 hover:scale-[1.01] hover:shadow-lg",
        "border-border/50 dark:border-border/30"
      )}
    >
      <div className="mb-4 flex min-h-[60px] items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {job.companyLogoUrl ? (
            <Image
              alt={job.companyName || "Company"}
              className="shrink-0 rounded-full object-cover"
              height={48}
              src={job.companyLogoUrl}
              width={48}
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary">
              <span className="font-semibold text-muted-foreground">
                {job.companyName?.[0] || "?"}
              </span>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 font-semibold leading-tight">
              {job.title}
            </h3>
            <p className="mt-1 truncate text-muted-foreground text-sm">
              {job.companyName}
            </p>
          </div>
        </div>

        <div className="w-20 shrink-0 text-right">
          {statusConfig && (
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          )}
        </div>
      </div>

      <div className="mb-4 flex h-6 flex-wrap items-center gap-2 text-muted-foreground text-sm">
        {job.city && (
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {job.city}
          </span>
        )}

        {job.workplaceType && (
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2.5 py-0.5 font-medium text-xs",
              getWorkplaceBadgeClass(job.workplaceType)
            )}
          >
            {job.workplaceType}
          </span>
        )}

        {job.experienceLevel && (
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2.5 py-0.5 font-medium text-xs",
              getExperienceBadgeClass(job.experienceLevel)
            )}
          >
            {job.experienceLevel}
          </span>
        )}
      </div>

      <div className="mb-4 h-12">
        {matchPercentage && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">
                Match Score
              </span>
              <span className="font-bold text-foreground">
                {matchPercentage}%
              </span>
            </div>
            <Progress
              className="h-2"
              indicatorClassName={getMatchColor(matchPercentage)}
              value={matchPercentage}
            />
          </div>
        )}
      </div>

      <p className="mb-4 h-5 font-medium text-sm">{salaryText}</p>

      <div className="mb-4 h-14">
        <div className="flex flex-wrap gap-2">
          {visibleTechs.map((tech) => (
            <Badge key={tech.name} variant="secondary">
              {tech.name}
            </Badge>
          ))}

          {remainingCount > 0 && (
            <Badge variant="outline">+{remainingCount} more</Badge>
          )}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
        <JobStatusDropdown currentStatus={job.status} jobId={job.id} />

        <div className="flex items-center gap-2">
          <DeleteJobButton jobId={job.id} />

          <Button asChild size="icon" variant="default">
            <a
              href={job.applicationUrl || job.offerUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">View Job</span>
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}

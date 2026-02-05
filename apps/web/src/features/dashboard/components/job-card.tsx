"use client";

import { Badge } from "@codeforge-v2/ui/components/badge";
import { Button } from "@codeforge-v2/ui/components/button";
import { Card } from "@codeforge-v2/ui/components/card";
import { TooltipWrapper } from "@codeforge-v2/ui/components/tooltip-wrapper";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { ExternalLink, MapPin } from "lucide-react";
import { CompanyAvatar } from "@/shared/components/ui/company-avatar";
import { MatchScoreIndicator } from "@/shared/components/ui/match-score-indicator";
import { STATUS_OPTIONS } from "../constants";
import type { UserJobOffer } from "../types";
import {
  getExperienceBadgeVariant,
  getWorkplaceBadgeVariant,
} from "../utils/badge-variants";
import {
  calculateMatchPercentage,
  formatSalaryDisplay,
} from "../utils/job-display";
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

  const salaryText = formatSalaryDisplay(
    job.salaryFrom,
    job.salaryTo,
    job.salaryCurrency
  );

  const matchPercentage = calculateMatchPercentage(job.similarityScore);

  const jobUrl = job.applicationUrl || job.offerUrl;

  const remainingTechs = job.technologies.slice(MAX_VISIBLE_TECHS);

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col p-5",
        "transition-all duration-200 hover:shadow-lg",
        "border-border/50 dark:border-border/30"
      )}
    >
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex min-h-[56px] items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <CompanyAvatar
              companyName={job.companyName || ""}
              logoUrl={job.companyLogoUrl}
              size="md"
            />

            <div className="min-w-0 flex-1">
              <TooltipWrapper content={<p className="max-w-xs">{job.title}</p>}>
                <h3 className="line-clamp-2 cursor-help font-semibold text-sm leading-tight">
                  {job.title}
                </h3>
              </TooltipWrapper>
              <p className="mt-0.5 truncate text-muted-foreground text-xs">
                {job.companyName}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {statusConfig && (
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            )}
          </div>
        </div>

        <div className="flex min-h-5 flex-wrap items-center gap-1.5 text-muted-foreground text-xs">
          {job.city && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.city}
            </span>
          )}

          {job.workplaceType && (
            <Badge
              className="text-xs"
              variant={getWorkplaceBadgeVariant(job.workplaceType)}
            >
              {job.workplaceType}
            </Badge>
          )}

          {job.experienceLevel && (
            <Badge
              className="text-xs"
              variant={getExperienceBadgeVariant(job.experienceLevel)}
            >
              {job.experienceLevel}
            </Badge>
          )}
        </div>

        <div className="h-10">
          {matchPercentage && (
            <MatchScoreIndicator percentage={matchPercentage} />
          )}
        </div>

        <p className="h-4 font-medium text-sm">{salaryText}</p>

        <div className="min-h-12">
          <div className="flex flex-wrap gap-1.5">
            {visibleTechs.map((tech) => (
              <Badge className="text-xs" key={tech.name} variant="secondary">
                {tech.name}
              </Badge>
            ))}

            {remainingCount > 0 && (
              <TooltipWrapper
                content={
                  <div className="flex max-w-sm flex-wrap gap-1">
                    {remainingTechs.map((tech) => (
                      <Badge
                        className="text-xs"
                        key={tech.name}
                        variant="secondary"
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                }
              >
                <Badge className="cursor-help text-xs" variant="outline">
                  +{remainingCount} more
                </Badge>
              </TooltipWrapper>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4">
        <JobStatusDropdown currentStatus={job.status} jobId={job.id} />

        <div className="flex items-center gap-2">
          <DeleteJobButton jobId={job.id} />

          {jobUrl && (
            <Button asChild size="icon" variant="default">
              <a href={jobUrl} rel="noopener noreferrer" target="_blank">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View Job</span>
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

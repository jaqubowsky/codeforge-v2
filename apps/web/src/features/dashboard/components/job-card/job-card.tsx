"use client";

import { Badge } from "@codeforge-v2/ui/components/badge";
import { Button } from "@codeforge-v2/ui/components/button";
import { TooltipWrapper } from "@codeforge-v2/ui/components/tooltip-wrapper";
import { cn } from "@codeforge-v2/ui/lib/utils";
import {
  Banknote,
  Building2,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";
import { CompanyAvatar } from "@/shared/components/ui/company-avatar";
import { GlassCard, GlassCardFooter } from "@/shared/components/ui/glass-card";
import type { UserJobOffer } from "../../types/dashboard";
import { DeleteJobButton } from "../delete-job-button";
import { JobStatusDropdown } from "../job-status-dropdown";
import { MatchScoreRing } from "../match-score-ring";
import {
  getExperienceBadgeVariant,
  getWorkplaceBadgeVariant,
} from "./badge-variants";
import { calculateMatchPercentage, formatSalaryDisplay } from "./job-display";

interface JobCardProps {
  job: UserJobOffer;
}

const MAX_VISIBLE_TECHS = 3;

export function JobCard({ job }: JobCardProps) {
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
    <GlassCard
      className={cn(
        "group relative flex h-full flex-col",
        "hover:-translate-y-1"
      )}
      elevated
      hoverable
    >
      <div className="absolute top-4 right-4">
        {matchPercentage && <MatchScoreRing percentage={matchPercentage} />}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <CompanyAvatar
              className="ring-2 ring-border/50"
              companyName={job.companyName || ""}
              logoUrl={job.companyLogoUrl}
              size="lg"
            />
            {job.status === "interviewing" && (
              <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-2 ring-card">
                <Sparkles className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1 pr-14">
            <TooltipWrapper content={<p className="max-w-xs">{job.title}</p>}>
              <h3 className="line-clamp-2 cursor-help font-semibold text-base leading-snug tracking-tight">
                {job.title}
              </h3>
            </TooltipWrapper>

            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{job.companyName}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
          {job.city && (
            <span className="flex items-center gap-1 rounded-full bg-muted/50 px-2.5 py-1">
              <MapPin className="h-3 w-3" />
              {job.city}
            </span>
          )}

          {job.workplaceType && (
            <Badge
              className="text-[10px]"
              variant={getWorkplaceBadgeVariant(job.workplaceType)}
            >
              {job.workplaceType}
            </Badge>
          )}

          {job.experienceLevel && (
            <Badge
              className="text-[10px]"
              variant={getExperienceBadgeVariant(job.experienceLevel)}
            >
              {job.experienceLevel}
            </Badge>
          )}
        </div>

        {salaryText && (
          <div className="mt-4 flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2",
                "bg-success/10",
                "border border-success/20"
              )}
            >
              <Banknote className="h-4 w-4 text-success" />
              <span className="font-semibold text-sm text-success">
                {salaryText}
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 flex-1">
          <div className="flex flex-wrap gap-1.5">
            {visibleTechs.map((tech) => (
              <Badge
                className="border-0 bg-secondary/80 text-[11px]"
                key={tech.name}
                variant="secondary"
              >
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
                <Badge
                  className="cursor-help border-dashed text-[11px]"
                  variant="outline"
                >
                  +{remainingCount}
                </Badge>
              </TooltipWrapper>
            )}
          </div>
        </div>
      </div>

      <GlassCardFooter className="flex items-center justify-between gap-3">
        <JobStatusDropdown currentStatus={job.status} jobId={job.id} />

        <div className="flex items-center gap-2">
          <DeleteJobButton jobId={job.id} />

          {jobUrl && (
            <Button
              asChild
              className={cn("gap-1.5 rounded-xl", "shadow-sm hover:shadow-md")}
              size="sm"
            >
              <a href={jobUrl} rel="noopener noreferrer" target="_blank">
                <span>Apply</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
        </div>
      </GlassCardFooter>
    </GlassCard>
  );
}

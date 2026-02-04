import { Badge } from "@codeforge-v2/ui/components/badge";
import { Button } from "@codeforge-v2/ui/components/button";
import { Card } from "@codeforge-v2/ui/components/card";
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
          <CompanyAvatar
            companyName={job.companyName || ""}
            logoUrl={job.companyLogoUrl}
            size="md"
          />

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
          <Badge variant={getWorkplaceBadgeVariant(job.workplaceType)}>
            {job.workplaceType}
          </Badge>
        )}

        {job.experienceLevel && (
          <Badge variant={getExperienceBadgeVariant(job.experienceLevel)}>
            {job.experienceLevel}
          </Badge>
        )}
      </div>

      <div className="mb-4 h-12">
        {matchPercentage && (
          <MatchScoreIndicator percentage={matchPercentage} />
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

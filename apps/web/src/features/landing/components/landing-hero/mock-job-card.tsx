"use client";

import { Badge } from "@codeforge-v2/ui/components/badge";
import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { Banknote, Building2, MapPin } from "lucide-react";
import { useDelayedVisibility } from "../../hooks/use-delayed-visibility";

function getMatchScoreStyles(score: number) {
  if (score >= 80) {
    return "stroke-success text-success";
  }
  if (score >= 60) {
    return "stroke-info text-info";
  }
  return "stroke-warning text-warning";
}

function getWorkplaceBadgeVariant(
  type: string
): "remote" | "hybrid" | "office" {
  if (type === "Remote") {
    return "remote";
  }
  if (type === "Hybrid") {
    return "hybrid";
  }
  return "office";
}

interface MockJobCardProps {
  title: string;
  company: string;
  companyInitials: string;
  location: string;
  workplaceType: "Remote" | "Hybrid" | "Office";
  salary: string;
  matchScore: number;
  technologies: string[];
  delay: number;
}

export function MockJobCard({
  title,
  company,
  companyInitials,
  location,
  workplaceType,
  salary,
  matchScore,
  technologies,
  delay,
}: MockJobCardProps) {
  const isVisible = useDelayedVisibility(delay);

  return (
    <div
      className={cn(
        "relative rounded-md border border-border/40 bg-card/60 p-3.5",
        "transition-all duration-700 ease-out",
        "hover:border-border/80 hover:bg-card/90",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <div className="absolute top-3 right-3">
        <div className="relative h-10 w-10">
          <svg
            aria-label={`Match score: ${matchScore}%`}
            className="-rotate-90"
            role="img"
            viewBox="0 0 36 36"
          >
            <circle
              className="stroke-muted"
              cx="18"
              cy="18"
              fill="none"
              r="15.5"
              strokeWidth="2.5"
            />
            <circle
              className={cn(
                "transition-all duration-500",
                getMatchScoreStyles(matchScore)
              )}
              cx="18"
              cy="18"
              fill="none"
              r="15.5"
              strokeDasharray={`${matchScore} 100`}
              strokeLinecap="round"
              strokeWidth="2.5"
            />
          </svg>
          <Text
            as="span"
            className={cn(
              "absolute inset-0 flex items-center justify-center font-semibold",
              getMatchScoreStyles(matchScore)
            )}
            variant="mono-sm"
          >
            {matchScore}
          </Text>
        </div>
      </div>

      <div className="flex items-start gap-3 pr-12">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-primary text-xs ring-1 ring-border/50">
          {companyInitials}
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          <h3 className="line-clamp-1 font-semibold text-sm leading-tight">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Building2 className="h-3 w-3 shrink-0" />
            <span className="truncate">{company}</span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <span className="flex items-center gap-1 rounded-sm bg-muted/40 px-2 py-0.5">
          <MapPin className="h-2.5 w-2.5 text-muted-foreground" />
          <Text as="span" muted variant="mono-sm">
            {location}
          </Text>
        </span>
        <Badge
          className="rounded-sm text-[10px]"
          variant={getWorkplaceBadgeVariant(workplaceType)}
        >
          {workplaceType}
        </Badge>
      </div>

      <div className="mt-2.5">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-sm px-2 py-1",
            "border border-success/20 bg-success/5"
          )}
        >
          <Banknote className="h-3 w-3 text-success" />
          <Text
            as="span"
            className="font-semibold text-success"
            variant="mono-sm"
          >
            {salary}
          </Text>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1">
        {technologies.map((tech) => (
          <Text
            as="span"
            className="rounded-sm bg-muted/50 px-1.5 py-0.5"
            key={tech}
            muted
            variant="mono-sm"
          >
            {tech}
          </Text>
        ))}
      </div>
    </div>
  );
}

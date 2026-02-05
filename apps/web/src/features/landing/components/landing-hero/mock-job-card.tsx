"use client";

import { Badge } from "@codeforge-v2/ui/components/badge";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { Banknote, Building2, MapPin } from "lucide-react";
import { GlassCard } from "@/shared/components/ui/glass-card";
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

function getWorkplaceBadgeVariant(type: string) {
  if (type === "Remote") {
    return "remote" as const;
  }
  if (type === "Hybrid") {
    return "hybrid" as const;
  }
  return "office" as const;
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
    <GlassCard
      className={cn(
        "relative p-4",
        "transition-all duration-700 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
      hoverable
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
              strokeWidth="3"
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
              strokeWidth="3"
            />
          </svg>
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center font-semibold text-xs",
              getMatchScoreStyles(matchScore)
            )}
          >
            {matchScore}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3 pr-12">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary text-sm ring-2 ring-border/50">
          {companyInitials}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="line-clamp-1 font-semibold text-sm leading-tight">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Building2 className="h-3 w-3 shrink-0" />
            <span className="truncate">{company}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
          <MapPin className="h-2.5 w-2.5" />
          {location}
        </span>
        <Badge
          className="text-[10px]"
          variant={getWorkplaceBadgeVariant(workplaceType)}
        >
          {workplaceType}
        </Badge>
      </div>

      <div className="mt-3">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5",
            "border border-success/20 bg-success/10"
          )}
        >
          <Banknote className="h-3.5 w-3.5 text-success" />
          <span className="font-semibold text-success text-xs">{salary}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {technologies.map((tech) => (
          <Badge
            className="border-0 bg-secondary/80 text-[10px]"
            key={tech}
            variant="secondary"
          >
            {tech}
          </Badge>
        ))}
      </div>
    </GlassCard>
  );
}

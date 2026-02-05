"use client";

import { Badge } from "@codeforge-v2/ui/components/badge";
import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { Briefcase, ExternalLink } from "lucide-react";
import { useDelayedVisibility } from "../../hooks/use-delayed-visibility";
import { MockJobCard } from "./mock-job-card";

const MOCK_JOBS: Array<{
  title: string;
  company: string;
  companyInitials: string;
  location: string;
  workplaceType: "Remote" | "Hybrid" | "Office";
  salary: string;
  matchScore: number;
  technologies: string[];
}> = [
  {
    title: "Senior React Developer",
    company: "TechCorp",
    companyInitials: "TC",
    location: "Berlin",
    workplaceType: "Remote",
    salary: "25-32k PLN",
    matchScore: 92,
    technologies: ["React", "TypeScript", "Node.js"],
  },
  {
    title: "Fullstack Engineer",
    company: "StartupXYZ",
    companyInitials: "SX",
    location: "Warsaw",
    workplaceType: "Hybrid",
    salary: "20-28k PLN",
    matchScore: 85,
    technologies: ["Next.js", "PostgreSQL"],
  },
];

export function DashboardMockup() {
  const isLoaded = useDelayedVisibility(300);

  return (
    <div
      className={cn(
        "relative w-full",
        "transition-all duration-700 ease-out",
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
    >
      <div className="overflow-hidden rounded-lg border border-border/50 bg-card/90 shadow-2xl shadow-black/5 backdrop-blur-sm dark:shadow-black/20">
        <div className="flex items-center justify-between border-border/30 border-b bg-muted/20 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-3 w-3 text-muted-foreground" />
              <Text as="span" variant="mono-sm">
                Job Tracker
              </Text>
            </div>
          </div>
          <Badge
            className="rounded-sm font-mono text-[9px] uppercase tracking-wider"
            variant="success"
          >
            2 new
          </Badge>
        </div>

        <div className="space-y-2.5 p-3">
          {MOCK_JOBS.map((job, index) => (
            <MockJobCard
              company={job.company}
              companyInitials={job.companyInitials}
              delay={600 + index * 250}
              key={job.title}
              location={job.location}
              matchScore={job.matchScore}
              salary={job.salary}
              technologies={job.technologies}
              title={job.title}
              workplaceType={job.workplaceType}
            />
          ))}
        </div>

        <div className="border-border/30 border-t bg-muted/10 px-4 py-2.5">
          <div className="flex items-center justify-between">
            <Text as="span" muted variant="mono-sm">
              2 matched
            </Text>
            <span className="flex items-center gap-1 text-primary">
              <Text as="span" variant="mono-sm">
                View all
              </Text>
              <ExternalLink className="h-2.5 w-2.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

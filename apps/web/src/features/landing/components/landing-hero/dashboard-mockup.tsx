"use client";

import { Badge } from "@codeforge-v2/ui/components/badge";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { Briefcase, ExternalLink } from "lucide-react";
import { GlassCard } from "@/shared/components/ui/glass-card";
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
      <GlassCard className="overflow-hidden" elevated>
        <div className="border-border/50 border-b bg-muted/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Briefcase className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-sm">Job Tracker</span>
            </div>
            <Badge className="text-xs" variant="success">
              2 new
            </Badge>
          </div>
        </div>

        <div className="space-y-3 p-4">
          {MOCK_JOBS.map((job, index) => (
            <MockJobCard
              company={job.company}
              companyInitials={job.companyInitials}
              delay={600 + index * 200}
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

        <div className="border-border/50 border-t bg-muted/20 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">
              2 matched jobs found
            </span>
            <span className="flex items-center gap-1 text-primary text-xs">
              View all
              <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

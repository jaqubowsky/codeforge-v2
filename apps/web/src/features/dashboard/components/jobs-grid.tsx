import type { UserJobOffer } from "../types";
import { JobCard } from "./job-card";
import { JobsEmptyState } from "./jobs-empty-state";

const GRID_COLUMNS = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

interface JobsGridProps {
  jobs: UserJobOffer[];
}

export function JobsGrid({ jobs }: JobsGridProps) {
  if (jobs.length === 0) {
    return <JobsEmptyState />;
  }

  return (
    <div className={`grid ${GRID_COLUMNS} gap-6`}>
      {jobs.map((job) => (
        <JobCard job={job} key={job.id} />
      ))}
    </div>
  );
}

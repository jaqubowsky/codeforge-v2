import type { UserJobOffer } from "../types";

export function calculateNewJobsCount(
  jobs: UserJobOffer[],
  lastRunAt: string | null
): number {
  if (lastRunAt === null) {
    return 0;
  }

  const lastRunDate = new Date(lastRunAt);

  return jobs.filter(
    (job) => job.status === "saved" && new Date(job.matchedAt) >= lastRunDate
  ).length;
}

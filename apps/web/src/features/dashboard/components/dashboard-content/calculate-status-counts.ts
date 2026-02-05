import type { UserJobOffer, UserOfferStatus } from "../../types/dashboard";

export type StatusCounts = Record<UserOfferStatus | "all", number>;

export function calculateStatusCounts(jobs: UserJobOffer[]): StatusCounts {
  const counts: StatusCounts = {
    all: jobs.length,
    saved: 0,
    applied: 0,
    interviewing: 0,
    rejected: 0,
    offer_received: 0,
    deleted: 0,
  };

  for (const job of jobs) {
    counts[job.status]++;
  }

  return counts;
}

import type { UserJobOffer } from "../types";

export function filterJobs(
  jobs: UserJobOffer[],
  search?: string | null,
  status?: string | null
): UserJobOffer[] {
  return jobs.filter((job) => {
    const matchesSearch = search
      ? job.title.toLowerCase().includes(search.toLowerCase()) ||
        (job.companyName?.toLowerCase() ?? "").includes(search.toLowerCase())
      : true;

    const matchesStatus = !status || status === "all" || job.status === status;

    return matchesSearch && matchesStatus;
  });
}

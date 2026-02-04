import { SALARY_MAX } from "../constants";
import type { Currency, SortOption, UserJobOffer } from "../types";

function sortJobs(jobs: UserJobOffer[], sortBy: SortOption): UserJobOffer[] {
  const sorted = [...jobs];

  switch (sortBy) {
    case "match_desc":
      return sorted.sort((a, b) => {
        const scoreA = a.similarityScore ?? -1;
        const scoreB = b.similarityScore ?? -1;
        return scoreB - scoreA;
      });

    case "match_asc":
      return sorted.sort((a, b) => {
        const scoreA = a.similarityScore ?? Number.POSITIVE_INFINITY;
        const scoreB = b.similarityScore ?? Number.POSITIVE_INFINITY;
        return scoreA - scoreB;
      });

    case "date_desc":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.matchedAt).getTime();
        const dateB = new Date(b.matchedAt).getTime();
        return dateB - dateA;
      });

    case "date_asc":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.matchedAt).getTime();
        const dateB = new Date(b.matchedAt).getTime();
        return dateA - dateB;
      });

    case "salary_desc":
      return sorted.sort((a, b) => {
        const salaryA = a.salaryTo ?? a.salaryFrom ?? -1;
        const salaryB = b.salaryTo ?? b.salaryFrom ?? -1;
        return salaryB - salaryA;
      });

    case "salary_asc":
      return sorted.sort((a, b) => {
        const salaryA = a.salaryTo ?? a.salaryFrom ?? Number.POSITIVE_INFINITY;
        const salaryB = b.salaryTo ?? b.salaryFrom ?? Number.POSITIVE_INFINITY;
        return salaryA - salaryB;
      });

    default:
      return sorted;
  }
}

function matchesSalaryRange(
  job: UserJobOffer,
  min: number,
  max: number,
  currency: Currency,
  salaryMax: number
): boolean {
  if (!(job.salaryCurrency && (job.salaryFrom || job.salaryTo))) {
    return min === 0;
  }

  if (job.salaryCurrency !== currency) {
    return true;
  }

  const jobMin = job.salaryFrom ?? 0;
  const jobMax = job.salaryTo ?? job.salaryFrom ?? 0;

  if (max === salaryMax) {
    return jobMax >= min;
  }

  return jobMax >= min && jobMin <= max;
}

function filterByNew(
  jobs: UserJobOffer[],
  lastRunCreatedAt: string | null
): UserJobOffer[] {
  if (!lastRunCreatedAt) {
    return [];
  }
  return jobs.filter(
    (job) => new Date(job.matchedAt) >= new Date(lastRunCreatedAt)
  );
}

export function filterJobs(
  jobs: UserJobOffer[],
  options: {
    search?: string | null;
    status?: string | null;
    sort?: SortOption;
    showOnlyNew?: boolean;
    lastRunCreatedAt?: string | null;
    salaryMin?: number | null;
    salaryMax?: number | null;
    currency?: Currency;
  }
): UserJobOffer[] {
  const {
    search,
    status,
    sort = "match_desc",
    showOnlyNew,
    lastRunCreatedAt,
    salaryMin,
    salaryMax,
    currency = "PLN",
  } = options;

  let filtered = jobs;

  if (search) {
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        (job.companyName?.toLowerCase() ?? "").includes(search.toLowerCase())
    );
  }

  const effectiveStatus = status || "saved";
  if (effectiveStatus !== "all") {
    filtered = filtered.filter((job) => job.status === effectiveStatus);
  }

  if (showOnlyNew && lastRunCreatedAt) {
    filtered = filterByNew(filtered, lastRunCreatedAt);
  }

  const effectiveMin = salaryMin ?? 0;
  const effectiveMax = salaryMax ?? SALARY_MAX;

  filtered = filtered.filter((job) =>
    matchesSalaryRange(job, effectiveMin, effectiveMax, currency, SALARY_MAX)
  );

  return sortJobs(filtered, sort);
}

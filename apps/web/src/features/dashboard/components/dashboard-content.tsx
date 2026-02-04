import { ErrorDisplay } from "@/shared/components/ui/error-display";
import { getDashboardData } from "../api";
import type { Currency, SortOption } from "../types";
import { calculateNewJobsCount } from "../utils/calculate-new-jobs-count";
import { filterJobs } from "../utils/filter-jobs";
import { DashboardHeader } from "./dashboard-header";
import { DashboardStats } from "./dashboard-stats";
import { JobsGrid } from "./jobs-grid";
import { SearchFilter } from "./search-filter";

interface DashboardContentProps {
  search?: string;
  status?: string;
  sort?: string;
  showOnlyNew?: string;
  salaryMin?: string;
  salaryMax?: string;
  currency?: string;
}

export async function DashboardContent({
  search,
  status,
  sort,
  showOnlyNew,
  salaryMin,
  salaryMax,
  currency,
}: DashboardContentProps) {
  const result = await getDashboardData();

  if (!(result.success && result.data)) {
    return (
      <ErrorDisplay
        centered
        message={result.error || "Failed to load dashboard"}
      />
    );
  }

  const { jobs, lastRun, salaryMetadata } = result.data;

  const newJobsCount = calculateNewJobsCount(jobs, lastRun.lastRunAt);

  const filteredJobs = filterJobs(jobs, {
    search,
    status,
    sort: sort as SortOption,
    showOnlyNew: showOnlyNew === "true",
    lastRunCreatedAt: lastRun.lastRunAt,
    salaryMin: salaryMin ? Number(salaryMin) : null,
    salaryMax: salaryMax ? Number(salaryMax) : null,
    currency: currency as Currency,
  });

  return (
    <div className="container space-y-8 px-6 py-8">
      <DashboardHeader />
      <DashboardStats jobCount={filteredJobs.length} lastRun={lastRun} />
      <SearchFilter
        currencies={salaryMetadata.currencies}
        maxSalary={salaryMetadata.maxSalary}
        newJobsCount={newJobsCount}
      />
      <JobsGrid jobs={filteredJobs} />
    </div>
  );
}

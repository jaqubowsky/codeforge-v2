import { ErrorDisplay } from "@/shared/components/ui/error-display";
import { getDashboardData } from "../../api";
import { SORT_OPTIONS, VALID_CURRENCIES } from "../../constants/filter-options";
import type { Currency, SortOption } from "../../types/dashboard";
import { DashboardHero } from "../dashboard-hero";
import { JobsGrid } from "../jobs-grid";
import { SearchFilter } from "../search-filter";
import { calculateNewJobsCount } from "./calculate-new-jobs-count";
import { calculateStatusCounts } from "./calculate-status-counts";
import { filterJobs } from "./filter-jobs";

function isSortOption(value: string | undefined): value is SortOption {
  return SORT_OPTIONS.some((opt) => opt.value === value);
}

function isCurrency(value: string | undefined): value is Currency {
  return VALID_CURRENCIES.some((v) => v === value);
}

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

  if (!result.success) {
    return <ErrorDisplay centered message={result.error} />;
  }

  const { jobs, lastRun, salaryMetadata } = result.data;

  const newJobsCount = calculateNewJobsCount(jobs, lastRun.lastRunAt);
  const statusCounts = calculateStatusCounts(jobs);

  const filteredJobs = filterJobs(jobs, {
    search,
    status,
    sort: isSortOption(sort) ? sort : undefined,
    showOnlyNew: showOnlyNew === "true",
    lastRunCreatedAt: lastRun.lastRunAt,
    salaryMin: salaryMin ? Number(salaryMin) : null,
    salaryMax: salaryMax ? Number(salaryMax) : null,
    currency: isCurrency(currency) ? currency : undefined,
  });

  return (
    <div className="min-h-screen">
      <DashboardHero
        lastRun={lastRun}
        newJobsCount={newJobsCount}
        statusCounts={statusCounts}
        totalJobs={jobs.length}
      />

      <div className="container space-y-8 px-6 py-8">
        <SearchFilter
          currencies={salaryMetadata.currencies}
          maxSalary={salaryMetadata.maxSalary}
          newJobsCount={newJobsCount}
          statusCounts={statusCounts}
        />
        <JobsGrid jobs={filteredJobs} />
      </div>
    </div>
  );
}

import { ErrorDisplay } from "@/shared/components/ui/error-display";
import { getDashboardData } from "../api";
import { filterJobs } from "../utils/filter-jobs";
import { DashboardHeader } from "./dashboard-header";
import { DashboardStats } from "./dashboard-stats";
import { JobsGrid } from "./jobs-grid";
import { SearchFilter } from "./search-filter";

interface DashboardContentProps {
  search?: string;
  status?: string;
}

export async function DashboardContent({
  search,
  status,
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

  const { jobs, lastRun } = result.data;

  const filteredJobs = filterJobs(jobs, search, status);

  return (
    <div className="container space-y-8 px-6 py-8">
      <DashboardHeader />
      <DashboardStats jobCount={filteredJobs.length} lastRun={lastRun} />
      <SearchFilter />
      <JobsGrid jobs={filteredJobs} />
    </div>
  );
}

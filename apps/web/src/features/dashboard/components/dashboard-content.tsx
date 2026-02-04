import { getDashboardData } from "../api";
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
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">
          {result.error || "Failed to load dashboard"}
        </p>
      </div>
    );
  }

  const { jobs, lastRun } = result.data;

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = search
      ? job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesStatus = !status || status === "all" || job.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container space-y-8 px-6 py-8">
      <DashboardHeader />
      <DashboardStats jobCount={filteredJobs.length} lastRun={lastRun} />
      <SearchFilter />
      <JobsGrid jobs={filteredJobs} />
    </div>
  );
}

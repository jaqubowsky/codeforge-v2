import { Suspense } from "react";
import { DashboardContent } from "@/features/dashboard/components/dashboard-content";

interface DashboardPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sort?: string;
    new?: string;
    salaryMin?: string;
    salaryMax?: string;
    currency?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent
        currency={params.currency}
        salaryMax={params.salaryMax}
        salaryMin={params.salaryMin}
        search={params.search}
        showOnlyNew={params.new}
        sort={params.sort}
        status={params.status}
      />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container space-y-8 px-6 py-8">
      <div className="flex items-center justify-between">
        <div className="h-10 w-48 animate-pulse rounded bg-muted" />
        <div className="h-11 w-32 animate-pulse rounded bg-muted" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="h-10 flex-1 animate-pulse rounded bg-muted" />
          <div className="h-10 w-[180px] animate-pulse rounded bg-muted" />
          <div className="flex flex-wrap gap-2">
            <div className="h-10 w-16 animate-pulse rounded-lg bg-muted" />
            <div className="h-10 w-20 animate-pulse rounded-lg bg-muted" />
            <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
            <div className="h-10 w-28 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>

        <div className="h-32 animate-pulse rounded-lg bg-muted" />

        <div className="flex justify-end">
          <div className="h-9 w-36 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((key) => (
          <div className="h-96 animate-pulse rounded-lg bg-muted" key={key} />
        ))}
      </div>
    </div>
  );
}

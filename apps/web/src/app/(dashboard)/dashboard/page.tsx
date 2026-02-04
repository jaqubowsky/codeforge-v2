import { Suspense } from "react";
import { DashboardContent } from "@/features/dashboard/components/dashboard-content";

interface DashboardPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent search={params.search} status={params.status} />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container space-y-8 px-6 py-8">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="h-12 w-full animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((key) => (
          <div className="h-64 animate-pulse rounded-lg bg-muted" key={key} />
        ))}
      </div>
    </div>
  );
}

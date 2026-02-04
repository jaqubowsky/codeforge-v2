import { Card } from "@codeforge-v2/ui/components/card";

export function JobCardSkeleton() {
  return (
    <Card className="space-y-4 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded-full bg-secondary" />
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
            <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
          </div>
        </div>
        <div className="h-6 w-16 animate-pulse rounded bg-secondary" />
      </div>

      <div className="flex gap-2">
        <div className="h-5 w-20 animate-pulse rounded bg-secondary" />
        <div className="h-5 w-20 animate-pulse rounded bg-secondary" />
      </div>

      <div className="h-4 w-48 animate-pulse rounded bg-secondary" />

      <div className="flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded bg-secondary" />
        <div className="h-6 w-16 animate-pulse rounded bg-secondary" />
        <div className="h-6 w-16 animate-pulse rounded bg-secondary" />
      </div>
    </Card>
  );
}

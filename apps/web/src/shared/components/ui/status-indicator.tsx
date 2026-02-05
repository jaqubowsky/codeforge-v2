import { cn } from "@codeforge-v2/ui/lib/utils";

type IndicatorStatus = "active" | "idle" | "error";

interface StatusIndicatorProps {
  status: IndicatorStatus;
  className?: string;
}

const STATUS_STYLES: Record<IndicatorStatus, string> = {
  active: "bg-success animate-pulse",
  idle: "bg-muted-foreground/50",
  error: "bg-destructive",
};

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  return (
    <div
      className={cn("h-2 w-2 rounded-full", STATUS_STYLES[status], className)}
    />
  );
}

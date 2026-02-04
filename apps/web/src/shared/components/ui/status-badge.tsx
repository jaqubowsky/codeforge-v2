import type { BadgeProps } from "@codeforge-v2/ui/components/badge";
import { Badge } from "@codeforge-v2/ui/components/badge";

type StatusType =
  | "saved"
  | "applied"
  | "interviewing"
  | "rejected"
  | "offer_received"
  | "running"
  | "completed"
  | "failed"
  | "idle";

const STATUS_CONFIG: Record<
  StatusType,
  { variant: NonNullable<BadgeProps["variant"]>; defaultLabel: string }
> = {
  saved: { variant: "info", defaultLabel: "Saved" },
  applied: { variant: "success", defaultLabel: "Applied" },
  interviewing: { variant: "warning", defaultLabel: "Interviewing" },
  rejected: { variant: "destructive", defaultLabel: "Rejected" },
  offer_received: { variant: "success", defaultLabel: "Offer Received" },
  running: { variant: "default", defaultLabel: "Scraping Active" },
  completed: { variant: "secondary", defaultLabel: "Completed" },
  failed: { variant: "destructive", defaultLabel: "Failed" },
  idle: { variant: "secondary", defaultLabel: "Idle" },
};

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge className={className} variant={config.variant}>
      {label || config.defaultLabel}
    </Badge>
  );
}

export type { StatusType };

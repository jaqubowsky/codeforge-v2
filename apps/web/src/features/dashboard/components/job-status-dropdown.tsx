"use client";

import { useJobStatus } from "../hooks/use-job-status";
import type { UserOfferStatus } from "../types";
import { StatusDropdown } from "./status-dropdown";

interface JobStatusDropdownProps {
  jobId: number;
  currentStatus: UserOfferStatus;
}

export function JobStatusDropdown({
  jobId,
  currentStatus,
}: JobStatusDropdownProps) {
  const { isPending, handleStatusChange } = useJobStatus({ jobId });

  return (
    <StatusDropdown
      currentStatus={currentStatus}
      disabled={isPending}
      onStatusChange={handleStatusChange}
    />
  );
}

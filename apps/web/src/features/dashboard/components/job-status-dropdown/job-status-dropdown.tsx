"use client";

import type { UserOfferStatus } from "../../types/dashboard";
import { StatusDropdown } from "../status-dropdown";
import { useJobStatus } from "./use-job-status";

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

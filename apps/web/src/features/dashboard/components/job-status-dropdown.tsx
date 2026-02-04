"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateJobStatus } from "../api";
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
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: UserOfferStatus) => {
    startTransition(async () => {
      const result = await updateJobStatus(jobId, newStatus);

      if (!result.success) {
        toast.error(result.error || "Failed to update status");
        return;
      }

      toast.success("Status updated");
    });
  };

  return (
    <StatusDropdown
      currentStatus={currentStatus}
      disabled={isPending}
      onStatusChange={handleStatusChange}
    />
  );
}

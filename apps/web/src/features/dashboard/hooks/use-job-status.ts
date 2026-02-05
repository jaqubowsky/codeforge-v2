"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateJobStatus } from "../api";
import type { UserOfferStatus } from "../types";

interface UseJobStatusProps {
  jobId: number;
}

export function useJobStatus({ jobId }: UseJobStatusProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: UserOfferStatus) => {
    startTransition(async () => {
      const result = await updateJobStatus(jobId, newStatus);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Status updated");
    });
  };

  return {
    isPending,
    handleStatusChange,
  };
}

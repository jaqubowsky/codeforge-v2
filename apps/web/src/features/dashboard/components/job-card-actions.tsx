"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteJob, updateJobStatus } from "../api";
import type { UserOfferStatus } from "../types";
import { StatusDropdown } from "./status-dropdown";

interface JobCardActionsProps {
  jobId: number;
  currentStatus: UserOfferStatus;
}

export function JobCardActions({ jobId, currentStatus }: JobCardActionsProps) {
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

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteJob(jobId);

      if (!result.success) {
        toast.error(result.error || "Failed to delete job");
        return;
      }

      toast.success("Job removed");
    });
  };

  return (
    <>
      <StatusDropdown
        currentStatus={currentStatus}
        disabled={isPending}
        onStatusChange={handleStatusChange}
      />

      <Button
        disabled={isPending}
        onClick={handleDelete}
        size="sm"
        variant="outline"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
}

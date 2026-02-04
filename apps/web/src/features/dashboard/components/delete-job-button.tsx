"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { ConfirmButton } from "@codeforge-v2/ui/components/confirm-button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteJob } from "../api";

interface DeleteJobButtonProps {
  jobId: number;
}

export function DeleteJobButton({ jobId }: DeleteJobButtonProps) {
  const handleDelete = async () => {
    const result = await deleteJob(jobId);

    if (!result.success) {
      toast.error(result.error || "Failed to delete job");
      return;
    }

    toast.success("Job removed");
  };

  return (
    <ConfirmButton
      confirmText="Delete"
      description="This will permanently remove this job from your list. This action cannot be undone."
      onConfirm={handleDelete}
      title="Delete Job?"
      variant="destructive"
    >
      <Button size="icon" variant="outline">
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete job</span>
      </Button>
    </ConfirmButton>
  );
}

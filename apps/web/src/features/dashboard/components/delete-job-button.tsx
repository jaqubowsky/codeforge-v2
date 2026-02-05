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
      toast.error(result.error);
      return;
    }

    toast.success("Job moved to Deleted");
  };

  return (
    <ConfirmButton
      confirmText="Delete"
      description="This job will be moved to your Deleted list. You can view deleted jobs in the Deleted tab."
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

"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteJob } from "../api";

interface DeleteJobButtonProps {
  jobId: number;
}

export function DeleteJobButton({ jobId }: DeleteJobButtonProps) {
  const [isPending, startTransition] = useTransition();

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
    <Button
      disabled={isPending}
      onClick={handleDelete}
      size="icon"
      variant="outline"
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Delete job</span>
    </Button>
  );
}

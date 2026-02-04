"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { triggerMatch } from "../api";

export function useRunNow() {
  const [isPending, startTransition] = useTransition();

  const handleRun = () => {
    startTransition(async () => {
      const result = await triggerMatch();

      if (!result.success) {
        toast.error(result.error || "Failed to find jobs");
        return;
      }

      const count = result.newJobsCount ?? 0;

      if (count === 0) {
        toast.info("No new matches found");
      } else {
        toast.success(`Found ${count} new ${count === 1 ? "job" : "jobs"}!`);
      }
    });
  };

  return {
    isPending,
    handleRun,
  };
}

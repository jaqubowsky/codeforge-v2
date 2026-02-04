"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { Loader2, Play } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { triggerMatch } from "../api";

export function RunNowButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
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

  return (
    <Button disabled={isPending} onClick={handleClick} size="lg">
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Finding Jobs...
        </>
      ) : (
        <>
          <Play className="mr-2 h-4 w-4" />
          Run Now
        </>
      )}
    </Button>
  );
}

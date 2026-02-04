"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { Loader2, Play } from "lucide-react";
import { useRunNow } from "../hooks/use-run-now";

export function RunNowButton() {
  const { isPending, handleRun } = useRunNow();

  return (
    <Button disabled={isPending} onClick={handleRun} size="lg">
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

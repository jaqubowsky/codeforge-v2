"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { Clock, Loader2, Play } from "lucide-react";
import { useRunNow } from "../hooks/use-run-now";

function getButtonContent(isLoading: boolean, isPending: boolean) {
  if (isLoading) {
    return (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </>
    );
  }

  if (isPending) {
    return (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Finding Jobs...
      </>
    );
  }

  return (
    <>
      <Play className="mr-2 h-4 w-4" />
      Run Now
    </>
  );
}

export function RunNowButton() {
  const { isPending, isLoading, isRateLimited, minutesRemaining, handleRun } =
    useRunNow();

  const isDisabled = isLoading || isPending || isRateLimited;

  return (
    <div className="flex flex-col items-end gap-1">
      <Button disabled={isDisabled} onClick={handleRun} size="lg">
        {getButtonContent(isLoading, isPending)}
      </Button>

      <p className="flex h-4 items-center gap-1 text-muted-foreground text-xs">
        {isRateLimited && minutesRemaining !== null && (
          <>
            <Clock className="h-3 w-3" />
            Available in {minutesRemaining} min
          </>
        )}
      </p>
    </div>
  );
}

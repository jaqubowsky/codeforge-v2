"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { Clock, Loader2, Play } from "lucide-react";
import { useRunNowContext } from "../context/run-now-context";

function ButtonContent({
  isLoading,
  isPending,
}: {
  isLoading: boolean;
  isPending: boolean;
}) {
  if (isLoading) {
    return (
      <>
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading...</span>
      </>
    );
  }

  if (isPending) {
    return (
      <>
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Finding Jobs...</span>
      </>
    );
  }

  return (
    <>
      <Play className="h-5 w-5" />
      <span>Scan for Jobs</span>
    </>
  );
}

interface RunNowButtonProps {
  variant?: "default" | "hero";
}

export function RunNowButton({ variant = "default" }: RunNowButtonProps) {
  const { isPending, isLoading, isRateLimited, minutesRemaining, handleRun } =
    useRunNowContext();

  const isDisabled = isLoading || isPending || isRateLimited;

  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        isHero ? "items-center" : "items-end"
      )}
    >
      <Button
        className={cn(
          "gap-2.5 font-semibold",
          isHero && "px-8 text-base shadow-lg",
          isDisabled && "opacity-70"
        )}
        data-umami-event="scan-jobs"
        disabled={isDisabled}
        onClick={handleRun}
        size="lg"
      >
        <ButtonContent isLoading={isLoading} isPending={isPending} />
      </Button>

      <Text
        as="span"
        className={cn(
          "flex h-5 items-center gap-1.5",
          isRateLimited ? "text-warning" : ""
        )}
        variant="caption"
      >
        {isRateLimited && minutesRemaining !== null ? (
          <>
            <Clock className="h-3 w-3" />
            <span>Available in {minutesRemaining} min</span>
          </>
        ) : (
          <span className="opacity-60">AI-powered job matching</span>
        )}
      </Text>
    </div>
  );
}

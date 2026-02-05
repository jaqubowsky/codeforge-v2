"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { checkRateLimit, scrapeAndMatch } from "../api";

const PROFILE_INCOMPLETE_ERRORS = [
  "profile not found",
  "embedding not found",
  "no skills found",
  "complete your profile",
];

function isProfileIncompleteError(error: string): boolean {
  const lowerError = error.toLowerCase();
  return PROFILE_INCOMPLETE_ERRORS.some((phrase) =>
    lowerError.includes(phrase)
  );
}

function isRateLimitError(error: string): boolean {
  return error.includes("rate limit") || error.includes("once per hour");
}

function handleError(error: string): void {
  if (isProfileIncompleteError(error)) {
    toast.info("Complete your profile to find matching jobs", {
      description: "Add skills and preferences to get personalized matches",
    });
    return;
  }

  if (isRateLimitError(error)) {
    toast.info("Please wait before running again", {
      description: error,
    });
    return;
  }

  toast.info("Could not find matches right now", {
    description: "Please try again later",
  });
}

function handleSuccess(newJobsCount: number, scrapedCount?: number): void {
  if (newJobsCount === 0) {
    toast.info("No new matches found", {
      description: "We'll keep looking for jobs that match your profile",
    });
    return;
  }

  const scrapedInfo = scrapedCount
    ? ` (scraped ${scrapedCount} fresh jobs)`
    : "";

  toast.success(
    `Found ${newJobsCount} new ${newJobsCount === 1 ? "job" : "jobs"}!${scrapedInfo}`
  );
}

interface RunNowContextValue {
  isPending: boolean;
  isLoading: boolean;
  isRateLimited: boolean;
  minutesRemaining: number | null;
  handleRun: () => void;
}

const RunNowContext = createContext<RunNowContextValue | null>(null);

export function RunNowProvider({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null);

  const refreshRateLimitStatus = useCallback(async () => {
    const result = await checkRateLimit();
    if (result.success) {
      setIsRateLimited(result.data.isLimited);
      setMinutesRemaining(result.data.minutesRemaining);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshRateLimitStatus();
  }, [refreshRateLimitStatus]);

  const handleRun = useCallback(() => {
    startTransition(async () => {
      const result = await scrapeAndMatch();

      if (!result.success) {
        handleError(result.error);
        await refreshRateLimitStatus();
        return;
      }

      handleSuccess(result.data.newJobsCount, result.data.scrapedCount);
      await refreshRateLimitStatus();
    });
  }, [refreshRateLimitStatus]);

  return (
    <RunNowContext.Provider
      value={{
        isPending,
        isLoading,
        isRateLimited,
        minutesRemaining,
        handleRun,
      }}
    >
      {children}
    </RunNowContext.Provider>
  );
}

export function useRunNowContext() {
  const context = useContext(RunNowContext);
  if (!context) {
    throw new Error("useRunNowContext must be used within RunNowProvider");
  }
  return context;
}

"use server";

import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createAuthenticatedClient } from "@/shared/supabase/server";

const RATE_LIMIT_HOURS = 1;

export interface RateLimitStatus {
  isLimited: boolean;
  minutesRemaining: number | null;
}

export async function checkRateLimit(): Promise<Result<RateLimitStatus>> {
  const authResult = await createAuthenticatedClient();
  if (!authResult.success) {
    return authResult;
  }
  const { supabase, userId } = authResult.data;

  const rateLimitCutoff = new Date(
    Date.now() - RATE_LIMIT_HOURS * 60 * 60 * 1000
  ).toISOString();

  const { data: recentRuns, error: runsError } = await supabase
    .from("match_runs")
    .select("started_at")
    .eq("user_id", userId)
    .eq("status", "completed")
    .gte("started_at", rateLimitCutoff)
    .order("started_at", { ascending: false })
    .limit(1);

  if (runsError) {
    return err("Failed to check rate limit");
  }

  const lastRun = recentRuns?.[0];
  if (!lastRun) {
    return ok({ isLimited: false, minutesRemaining: null });
  }

  const lastRunTime = new Date(lastRun.started_at).getTime();
  const nextAllowedTime = lastRunTime + RATE_LIMIT_HOURS * 60 * 60 * 1000;
  const now = Date.now();

  if (now >= nextAllowedTime) {
    return ok({ isLimited: false, minutesRemaining: null });
  }

  const minutesRemaining = Math.ceil((nextAllowedTime - now) / (60 * 1000));

  return ok({ isLimited: true, minutesRemaining });
}

"use server";

import { scrapeOffers } from "@codeforge-v2/scraper";
import { revalidatePath } from "next/cache";
import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createClient } from "@/shared/supabase/server";
import type { ScrapeAndMatchData } from "../types/dashboard";
import { matchJobs } from "./match-jobs";

const RATE_LIMIT_HOURS = 1;

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function validateAuth(
  supabase: SupabaseClient
): Promise<string | Result<never>> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return err("Not authenticated");
  }

  return user.id;
}

async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string
): Promise<Result<never> | null> {
  const rateLimitCutoff = new Date(
    Date.now() - RATE_LIMIT_HOURS * 60 * 60 * 1000
  ).toISOString();

  const { data: recentRuns } = await supabase
    .from("match_runs")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "completed")
    .gte("started_at", rateLimitCutoff)
    .limit(1);

  if (recentRuns && recentRuns.length > 0) {
    return err(
      "You can only run matching once per hour. Please try again later."
    );
  }

  return null;
}

async function validateProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Result<never> | null> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("skills, embedding")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return err("Profile not found. Please complete your profile.");
  }

  if (!profile.embedding) {
    return err("Profile embedding not found. Please complete your profile.");
  }

  if (!profile.skills || profile.skills.length === 0) {
    return err("No skills found in your profile. Please add skills first.");
  }

  return null;
}

async function updateMatchRun(
  supabase: SupabaseClient,
  matchRunId: number,
  data: {
    status: "completed" | "failed";
    newJobsCount?: number;
    errorMessage?: string;
  }
): Promise<void> {
  await supabase
    .from("match_runs")
    .update({
      finished_at: new Date().toISOString(),
      status: data.status,
      new_jobs_count: data.newJobsCount ?? 0,
      error_message: data.errorMessage,
    })
    .eq("id", matchRunId);
}

async function executeMatchingFlow(
  supabase: SupabaseClient,
  matchRunId: number
): Promise<Result<ScrapeAndMatchData>> {
  const firstMatchResult = await matchJobs();

  if (
    firstMatchResult.success &&
    (firstMatchResult.data.newMatchesCount ?? 0) > 0
  ) {
    await updateMatchRun(supabase, matchRunId, {
      status: "completed",
      newJobsCount: firstMatchResult.data.newMatchesCount ?? 0,
    });

    return ok({
      newJobsCount: firstMatchResult.data.newMatchesCount,
    });
  }

  const scrapeResult = await scrapeOffers({
    maxOffers: 500,
  });

  if (!scrapeResult.success) {
    await updateMatchRun(supabase, matchRunId, {
      status: "failed",
      errorMessage: scrapeResult.error ?? "Scraping failed",
    });

    return err(scrapeResult.error ?? "Failed to scrape jobs");
  }

  const secondMatchResult = await matchJobs();

  await updateMatchRun(supabase, matchRunId, {
    status: secondMatchResult.success ? "completed" : "failed",
    newJobsCount: secondMatchResult.success
      ? secondMatchResult.data.newMatchesCount
      : 0,
    errorMessage: secondMatchResult.success
      ? undefined
      : secondMatchResult.error,
  });

  if (!secondMatchResult.success) {
    return err(secondMatchResult.error);
  }

  return ok({
    newJobsCount: secondMatchResult.data.newMatchesCount,
    scrapedCount: scrapeResult.offersCount,
  });
}

export async function scrapeAndMatch(): Promise<Result<ScrapeAndMatchData>> {
  const supabase = await createClient();

  const authResult = await validateAuth(supabase);
  if (typeof authResult !== "string") {
    return authResult;
  }

  const userId = authResult;

  const rateLimitResult = await checkRateLimit(supabase, userId);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  const profileResult = await validateProfile(supabase, userId);
  if (profileResult) {
    return profileResult;
  }

  const { data: matchRun, error: createError } = await supabase
    .from("match_runs")
    .insert({
      user_id: userId,
      status: "running",
    })
    .select()
    .single();

  if (createError || !matchRun) {
    return err("Failed to create match run");
  }

  try {
    const result = await executeMatchingFlow(supabase, matchRun.id);
    revalidatePath("/dashboard");
    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    await updateMatchRun(supabase, matchRun.id, {
      status: "failed",
      errorMessage,
    });

    return err(errorMessage);
  }
}

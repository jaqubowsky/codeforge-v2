"use server";

import {
  mapSkillsToCategories,
  mapSkillsToNoFluffJobsCategories,
  scrapeOffers,
} from "@codeforge-v2/scraper";
import { revalidatePath } from "next/cache";
import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import {
  createAuthenticatedClient,
  type createClient,
} from "@/shared/supabase/server";
import type { ScrapeAndMatchData } from "../types/dashboard";
import { matchJobs } from "./match-jobs";

const RATE_LIMIT_HOURS = 1;

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

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

async function fetchUserSkills(
  supabase: SupabaseClient,
  userId: string
): Promise<string[] | Result<never>> {
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

  return profile.skills;
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
  matchRunId: number,
  userSkills: string[]
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

  const jjiCategories = mapSkillsToCategories(userSkills);
  const nfjCategories = mapSkillsToNoFluffJobsCategories(userSkills);

  const justjoinitResult = await scrapeOffers({
    board: "justjoinit",
    maxOffers: 500,
    categories: jjiCategories.length > 0 ? jjiCategories : undefined,
  });

  const nofluffjobsResult = await scrapeOffers({
    board: "nofluffjobs",
    maxOffers: 500,
    categories: nfjCategories.length > 0 ? nfjCategories : undefined,
  });

  const scrapeSuccess = justjoinitResult.success || nofluffjobsResult.success;

  if (!scrapeSuccess) {
    const errorMessage =
      justjoinitResult.error ?? nofluffjobsResult.error ?? "Scraping failed";

    await updateMatchRun(supabase, matchRunId, {
      status: "failed",
      errorMessage,
    });

    return err(errorMessage);
  }

  const totalScraped =
    (justjoinitResult.offersCount ?? 0) + (nofluffjobsResult.offersCount ?? 0);

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
    scrapedCount: totalScraped,
  });
}

export async function scrapeAndMatch(): Promise<Result<ScrapeAndMatchData>> {
  const authResult = await createAuthenticatedClient();
  if (!authResult.success) {
    return authResult;
  }
  const { supabase, userId } = authResult.data;

  const rateLimitResult = await checkRateLimit(supabase, userId);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  const skillsResult = await fetchUserSkills(supabase, userId);
  if (!Array.isArray(skillsResult)) {
    return skillsResult;
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
    const result = await executeMatchingFlow(
      supabase,
      matchRun.id,
      skillsResult
    );
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

"use server";

import { createClient } from "@/shared/supabase/server";
import type { MatchJobsResult } from "../types";

const MATCH_THRESHOLD = 0.4;
const MATCH_COUNT = 50;

export async function matchJobs(): Promise<MatchJobsResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: "You must be logged in to match jobs",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("embedding")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.embedding) {
    return {
      success: false,
      error: "Profile embedding not found. Please complete your profile.",
    };
  }

  const { data: matches, error: matchError } = await supabase.rpc(
    "match_jobs_for_user",
    {
      user_embedding: profile.embedding,
      match_threshold: MATCH_THRESHOLD,
      match_count: MATCH_COUNT,
    }
  );

  if (matchError) {
    return {
      success: false,
      error: `Failed to find matching jobs: ${matchError.message}`,
    };
  }

  if (!matches || matches.length === 0) {
    return {
      success: true,
      newMatchesCount: 0,
      error: null,
    };
  }

  const { data: existingOffers, error: existingError } = await supabase
    .from("user_offers")
    .select("offer_id")
    .eq("user_id", user.id);

  if (existingError) {
    return {
      success: false,
      error: `Failed to check existing offers: ${existingError.message}`,
    };
  }

  const existingOfferIds = new Set(
    existingOffers?.map((o) => o.offer_id) || []
  );

  const newMatches = matches.filter(
    (match) => !existingOfferIds.has(match.offer_id)
  );

  if (newMatches.length === 0) {
    return {
      success: true,
      newMatchesCount: 0,
      error: null,
    };
  }

  const userOffers = newMatches.map((match) => ({
    user_id: user.id,
    offer_id: match.offer_id,
    status: "saved" as const,
    similarity_score: match.similarity,
  }));

  const { error: insertError } = await supabase
    .from("user_offers")
    .insert(userOffers);

  if (insertError) {
    return {
      success: false,
      error: `Failed to save matches: ${insertError.message}`,
    };
  }

  return {
    success: true,
    newMatchesCount: newMatches.length,
    error: null,
  };
}

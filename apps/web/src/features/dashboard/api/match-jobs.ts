"use server";

import type { Database } from "@codeforge-v2/database";
import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createClient } from "@/shared/supabase/server";
import type { MatchJobsData } from "../types";

type UserOfferInsert = Database["public"]["Tables"]["user_offers"]["Insert"];

const MATCH_THRESHOLD = 0.4;
const MATCH_COUNT = 50;

export async function matchJobs(): Promise<Result<MatchJobsData>> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return err("You must be logged in to match jobs");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("embedding")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.embedding) {
    return err("Profile embedding not found. Please complete your profile.");
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
    return err(`Failed to find matching jobs: ${matchError.message}`);
  }

  if (!matches || matches.length === 0) {
    return ok({ newMatchesCount: 0 });
  }

  const { data: existingOffers, error: existingError } = await supabase
    .from("user_offers")
    .select("offer_id")
    .eq("user_id", user.id);

  if (existingError) {
    return err(`Failed to check existing offers: ${existingError.message}`);
  }

  const excludedOfferIds = new Set(
    existingOffers?.map((o) => o.offer_id) || []
  );

  const newMatches = matches.filter(
    (match) => !excludedOfferIds.has(match.offer_id)
  );

  if (newMatches.length === 0) {
    return ok({ newMatchesCount: 0 });
  }

  const userOffers: UserOfferInsert[] = newMatches.map((match) => ({
    user_id: user.id,
    offer_id: match.offer_id,
    status: "saved",
    similarity_score: match.similarity,
  }));

  const { error: insertError } = await supabase
    .from("user_offers")
    .insert(userOffers);

  if (insertError) {
    return err(`Failed to save matches: ${insertError.message}`);
  }

  return ok({ newMatchesCount: newMatches.length });
}

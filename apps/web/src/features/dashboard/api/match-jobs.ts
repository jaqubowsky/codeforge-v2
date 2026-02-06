"use server";

import type { Database } from "@codeforge-v2/database";
import {
  formatJobDocument,
  formatProfileQuery,
  reranker,
} from "@codeforge-v2/embeddings";
import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createClient } from "@/shared/supabase/server";
import type { MatchJobsData } from "../types/dashboard";

type UserOfferInsert = Database["public"]["Tables"]["user_offers"]["Insert"];

const MATCH_THRESHOLD = 0.3;
const MIN_SKILL_MATCHES = 1;
const MATCH_COUNT = 50;
const RERANK_COUNT = 20;
const MIN_RERANK_SCORE = 0.5;

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
    .select(
      "embedding, experience_level, preferred_locations, skills, ideal_role_description"
    )
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return err("Profile not found. Please complete your profile.");
  }

  if (
    !(
      profile.embedding &&
      profile.experience_level?.length &&
      profile.preferred_locations?.length &&
      profile.skills?.length
    )
  ) {
    return err(
      "Profile incomplete. Please fill in your skills, experience level, and work location preferences."
    );
  }

  const { data: matches, error: matchError } = await supabase.rpc(
    "match_jobs_for_user",
    {
      user_embedding: profile.embedding,
      user_job_titles: [],
      user_experience_levels: profile.experience_level,
      user_work_locations: profile.preferred_locations,
      user_skills: profile.skills,
      match_threshold: MATCH_THRESHOLD,
      min_skill_matches: MIN_SKILL_MATCHES,
      match_count: MATCH_COUNT,
    }
  );

  if (matchError) {
    return err(`Failed to find matching jobs: ${matchError.message}`);
  }

  if (!matches || matches.length === 0) {
    return ok({ newMatchesCount: 0 });
  }

  const offerIds = matches.map((m) => m.offer_id);

  const { data: offers, error: offersError } = await supabase
    .from("offers")
    .select(
      `
      id, title, company_name, experience_level, workplace_type, city,
      salary_from, salary_to, salary_currency,
      offer_technologies (
        technologies (name)
      )
    `
    )
    .in("id", offerIds);

  if (offersError || !offers) {
    return err(`Failed to fetch offer details: ${offersError?.message}`);
  }

  const offersMap = new Map(offers.map((o) => [o.id, o]));
  const offersArray = offerIds
    .map((id) => offersMap.get(id))
    .filter((o) => o != null);

  const profileQuery = formatProfileQuery({
    skills: profile.skills,
    experienceLevels: profile.experience_level,
    workLocations: profile.preferred_locations,
    idealRoleDescription: profile.ideal_role_description || "",
  });

  const jobDocuments = offersArray.map((offer) => {
    const technologies = (offer.offer_technologies || [])
      .map((ot) => {
        const tech = ot.technologies;
        if (Array.isArray(tech)) {
          return tech[0]?.name;
        }
        return tech?.name;
      })
      .filter((name): name is string => Boolean(name));

    return formatJobDocument({
      title: offer.title,
      companyName: offer.company_name,
      experienceLevel: offer.experience_level,
      workplaceType: offer.workplace_type,
      city: offer.city,
      technologies,
      salaryFrom: offer.salary_from,
      salaryTo: offer.salary_to,
      salaryCurrency: offer.salary_currency,
    });
  });

  let rerankedMatches: { offerId: number; score: number }[];
  try {
    const ranked = await reranker.rankPairs(profileQuery, jobDocuments);
    const top = ranked.slice(0, RERANK_COUNT);

    rerankedMatches = top
      .filter(
        (r) => offersArray[r.index] != null && r.score >= MIN_RERANK_SCORE
      )
      .map((r) => ({
        offerId: offersArray[r.index]!.id,
        score: r.score,
      }));
  } catch (_error) {
    return err("Failed to re-rank job matches. Please try again.");
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

  const newMatches = rerankedMatches.filter(
    (match) => !excludedOfferIds.has(match.offerId)
  );

  if (newMatches.length === 0) {
    return ok({ newMatchesCount: 0 });
  }

  const userOffers: UserOfferInsert[] = newMatches.map((match) => ({
    user_id: user.id,
    offer_id: match.offerId,
    status: "saved",
    similarity_score: match.score,
  }));

  const { error: insertError } = await supabase
    .from("user_offers")
    .insert(userOffers);

  if (insertError) {
    return err(`Failed to save matches: ${insertError.message}`);
  }

  return ok({ newMatchesCount: newMatches.length });
}

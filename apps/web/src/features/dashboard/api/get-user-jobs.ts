"use server";

import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createClient } from "@/shared/supabase/server";
import type { UserJobOffer, UserOfferStatus } from "../types/dashboard";
import { mapUserJobOffer } from "./mappers/dashboard";

const DEFAULT_JOB_LIMIT = 20;

async function getUserJobsFromDB(
  userId: string,
  status?: UserOfferStatus,
  limit = DEFAULT_JOB_LIMIT
) {
  const supabase = await createClient();

  let query = supabase
    .from("user_offers")
    .select(
      `
      similarity_score,
      status,
      created_at,
      offers (
        id,
        title,
        company_name,
        company_logo_thumb_url,
        workplace_type,
        experience_level,
        city,
        salary_from,
        salary_to,
        salary_currency,
        salary_period,
        application_url,
        offer_url,
        published_at,
        offer_technologies (
          skill_level,
          technologies (
            name
          )
        )
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(mapUserJobOffer).filter((job) => job !== null);
}

export async function getUserJobs(
  status?: UserOfferStatus,
  limit = DEFAULT_JOB_LIMIT
): Promise<Result<UserJobOffer[]>> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return err("You must be logged in to view jobs");
  }

  try {
    const jobs = await getUserJobsFromDB(user.id, status, limit);
    return ok(jobs);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Failed to fetch jobs");
  }
}

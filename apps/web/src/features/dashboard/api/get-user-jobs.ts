"use server";

import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createAuthenticatedClient } from "@/shared/supabase/server";
import type { UserJobOffer, UserOfferStatus } from "../types/dashboard";
import { mapUserJobOffer } from "./mappers/dashboard";

const DEFAULT_JOB_LIMIT = 20;

export async function getUserJobs(
  status?: UserOfferStatus,
  limit = DEFAULT_JOB_LIMIT
): Promise<Result<UserJobOffer[]>> {
  const authResult = await createAuthenticatedClient();
  if (!authResult.success) {
    return authResult;
  }
  const { supabase, userId } = authResult.data;

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
    return err(error.message);
  }

  return ok((data || []).map(mapUserJobOffer).filter((job) => job !== null));
}

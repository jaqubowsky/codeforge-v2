"use server";

import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createAuthenticatedClient } from "@/shared/supabase/server";
import type { ProfileData } from "../types/profile";
import { mapProfile } from "./mappers/profile";

export async function getProfile(): Promise<Result<ProfileData>> {
  const authResult = await createAuthenticatedClient();
  if (!authResult.success) {
    return authResult;
  }
  const { supabase, userId } = authResult.data;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "experience_level, preferred_locations, skills, ideal_role_description"
    )
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return err("Failed to fetch profile data");
  }

  return ok(mapProfile(profile));
}

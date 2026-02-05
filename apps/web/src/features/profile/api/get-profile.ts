"use server";

import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createClient } from "@/shared/supabase/server";
import type { ProfileData } from "../types";
import { mapProfile } from "./mappers";

export async function getProfile(): Promise<Result<ProfileData>> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return err("You must be logged in to view your profile");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "experience_level, preferred_locations, skills, ideal_role_description"
    )
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return err("Failed to fetch profile data");
  }

  return ok(mapProfile(profile));
}

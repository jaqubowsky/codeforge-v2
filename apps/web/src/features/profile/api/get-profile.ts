"use server";

import { createClient } from "@/shared/supabase/server";

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: "You must be logged in to view your profile",
      data: null,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("job_title, years_experience, skills, ideal_role_description")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      success: false,
      error: "Failed to fetch profile data",
      data: null,
    };
  }

  return {
    success: true,
    error: null,
    data: profile,
  };
}

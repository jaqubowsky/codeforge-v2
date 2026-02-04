"use server";

import { createClient } from "@/shared/supabase/server";
import { YEARS_EXPERIENCE_OPTIONS } from "../constants";
import type { OnboardingFormData } from "../schemas";

export async function completeOnboarding(data: OnboardingFormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: "You must be logged in to complete onboarding",
    };
  }

  // Map years experience string to numeric value for database
  const yearsExperienceOption = YEARS_EXPERIENCE_OPTIONS.find(
    (opt) => opt.value === data.yearsExperience
  );
  const yearsExperienceNumeric = yearsExperienceOption?.numericValue ?? 0;

  // Update profile
  const { error } = await supabase
    .from("profiles")
    .update({
      job_title: data.jobTitle,
      years_experience: yearsExperienceNumeric,
      skills: data.skills,
      ideal_role_description: data.idealRoleDescription,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

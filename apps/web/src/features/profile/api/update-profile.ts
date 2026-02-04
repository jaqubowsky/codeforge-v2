"use server";

import { embeddings } from "@codeforge-v2/embeddings";
import { revalidatePath } from "next/cache";
import { YEARS_EXPERIENCE_OPTIONS } from "@/shared/constants/profile";
import { createClient } from "@/shared/supabase/server";
import type { ProfileFormData } from "../schemas";

export async function updateProfile(data: ProfileFormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: "You must be logged in to update your profile",
    };
  }

  const yearsExperienceOption = YEARS_EXPERIENCE_OPTIONS.find(
    (opt) => opt.value === data.yearsExperience
  );
  const yearsExperienceNumeric = yearsExperienceOption?.numericValue ?? 0;

  const profileText = `${data.jobTitle} | ${yearsExperienceNumeric} years experience | ${data.skills.join(", ")} | ${data.idealRoleDescription}`;

  let embedding: number[] | null = null;

  try {
    embedding = await embeddings.generateEmbedding(profileText);
  } catch (error) {
    console.error("Embedding generation failed:", error);
    return {
      success: false,
      error: "Failed to generate profile embedding. Please try again.",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      job_title: data.jobTitle,
      years_experience: yearsExperienceNumeric,
      skills: data.skills,
      ideal_role_description: data.idealRoleDescription,
      embedding: JSON.stringify(embedding),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/profile");

  return { success: true, error: null };
}

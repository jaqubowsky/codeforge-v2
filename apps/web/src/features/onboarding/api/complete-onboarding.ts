"use server";

import { embeddings } from "@codeforge-v2/embeddings";
import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createClient } from "@/shared/supabase/server";
import type { OnboardingFormData } from "../schemas";

export async function completeOnboarding(
  data: OnboardingFormData
): Promise<Result<void>> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return err("You must be logged in to complete onboarding");
  }

  const jobTitles = data.jobTitles.join(", ");
  const experienceLevels = data.experienceLevel.join(", ");
  const workLocations = data.preferredLocations.join(", ");

  const profileText = `Job titles: ${jobTitles} | Experience levels: ${experienceLevels} | Work locations: ${workLocations} | ${data.skills.join(", ")} | ${data.idealRoleDescription}`;

  let embedding: number[] | null = null;

  try {
    embedding = await embeddings.generateEmbedding(profileText);
  } catch (_error) {
    return err("Failed to generate profile embedding. Please try again.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      job_titles: data.jobTitles,
      experience_level: data.experienceLevel,
      preferred_locations: data.preferredLocations,
      skills: data.skills,
      ideal_role_description: data.idealRoleDescription,
      embedding: JSON.stringify(embedding),
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return err(error.message);
  }

  return ok(undefined);
}

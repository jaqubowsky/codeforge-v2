"use server";

import { embeddings } from "@codeforge-v2/embeddings";
import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createAuthenticatedClient } from "@/shared/supabase/server";
import type { OnboardingFormData } from "../schemas/onboarding";

export async function completeOnboarding(
  data: OnboardingFormData
): Promise<Result<void>> {
  const authResult = await createAuthenticatedClient();
  if (!authResult.success) {
    return authResult;
  }
  const { supabase, userId } = authResult.data;

  const experienceLevels = data.experienceLevel.join(", ");
  const workLocations = data.preferredLocations.join(", ");

  const profileParts = [
    `Skills: ${data.skills.join(", ")}`,
    `Experience levels: ${experienceLevels}`,
    `Work locations: ${workLocations}`,
  ];

  if (data.idealRoleDescription) {
    profileParts.push(data.idealRoleDescription);
  }

  const profileText = profileParts.join(" | ");

  let embedding: number[] | null = null;

  try {
    embedding = await embeddings.generateEmbedding(profileText);
  } catch (_error) {
    return err("Failed to generate profile embedding. Please try again.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      experience_level: data.experienceLevel,
      preferred_locations: data.preferredLocations,
      skills: data.skills,
      ideal_role_description: data.idealRoleDescription,
      embedding: JSON.stringify(embedding),
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    return err(error.message);
  }

  return ok(undefined);
}

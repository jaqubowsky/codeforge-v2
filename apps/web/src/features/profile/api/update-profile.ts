"use server";

import { embeddings } from "@codeforge-v2/embeddings";
import { revalidatePath } from "next/cache";
import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createAuthenticatedClient } from "@/shared/supabase/server";
import type { ProfileFormData } from "../schemas/profile";

export async function updateProfile(
  data: ProfileFormData
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    return err(error.message);
  }

  revalidatePath("/profile");

  return ok(undefined);
}

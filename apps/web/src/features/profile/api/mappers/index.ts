import type { Database } from "@codeforge-v2/database";
import type { ProfileData } from "../../types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type ProfileDTO = Pick<
  ProfileRow,
  | "experience_level"
  | "preferred_locations"
  | "skills"
  | "ideal_role_description"
>;

export function mapProfile(dto: ProfileDTO): ProfileData {
  const experienceLevel = dto.experience_level ?? [];
  const preferredLocations = dto.preferred_locations ?? [];

  return {
    skills: dto.skills ?? [],
    experienceLevel,
    preferredLocations,
    idealRoleDescription: dto.ideal_role_description ?? "",
  };
}

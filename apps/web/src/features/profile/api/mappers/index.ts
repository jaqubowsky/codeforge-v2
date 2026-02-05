import type { Database } from "@codeforge-v2/database";
import type { ProfileData } from "../../types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type ProfileDTO = Pick<
  ProfileRow,
  | "job_titles"
  | "experience_level"
  | "preferred_locations"
  | "skills"
  | "ideal_role_description"
>;

export function mapProfile(dto: ProfileDTO): ProfileData {
  const experienceLevel = dto.experience_level ?? [];
  const preferredLocations = dto.preferred_locations ?? [];

  return {
    jobTitles: dto.job_titles ?? [],
    experienceLevel,
    preferredLocations,
    skills: dto.skills ?? [],
    idealRoleDescription: dto.ideal_role_description ?? "",
  };
}

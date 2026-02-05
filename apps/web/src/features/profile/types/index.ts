export type ExperienceLevel = "junior" | "mid" | "senior" | "c-level";
export type WorkLocation = "remote" | "hybrid" | "office";

export interface ProfileData {
  skills: string[];
  experienceLevel: ExperienceLevel[];
  preferredLocations: WorkLocation[];
  idealRoleDescription: string;
}

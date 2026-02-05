export type ExperienceLevel = "junior" | "mid" | "senior" | "c-level";
export type WorkLocation = "remote" | "hybrid" | "office";

export interface ProfileData {
  jobTitles: string[];
  experienceLevel: ExperienceLevel[];
  preferredLocations: WorkLocation[];
  skills: string[];
  idealRoleDescription: string;
}

type ExperienceLevel = "junior" | "mid" | "senior" | "c-level";

export const EXPERIENCE_LEVEL_OPTIONS: Array<{
  value: ExperienceLevel;
  label: string;
  description: string;
}> = [
  {
    value: "junior",
    label: "Junior",
    description: "0-2 years of experience",
  },
  {
    value: "mid",
    label: "Mid-Level",
    description: "2-5 years of experience",
  },
  {
    value: "senior",
    label: "Senior",
    description: "5+ years of experience",
  },
  {
    value: "c-level",
    label: "C-Level / Lead",
    description: "Leadership and executive roles",
  },
] as const;

type WorkLocation = "remote" | "hybrid" | "office";

export const WORK_LOCATION_OPTIONS: Array<{
  value: WorkLocation;
  label: string;
  description: string;
}> = [
  {
    value: "remote",
    label: "Remote",
    description: "Work from anywhere",
  },
  {
    value: "hybrid",
    label: "Hybrid",
    description: "Mix of remote and office",
  },
  {
    value: "office",
    label: "Office",
    description: "On-site work only",
  },
] as const;

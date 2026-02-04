export type YearsExperience = "0-1" | "1-3" | "3-5" | "5-10" | "10+";

export const YEARS_EXPERIENCE_OPTIONS: Array<{
  value: YearsExperience;
  label: string;
  numericValue: number;
}> = [
  { value: "0-1", label: "0-1 years", numericValue: 0 },
  { value: "1-3", label: "1-3 years", numericValue: 2 },
  { value: "3-5", label: "3-5 years", numericValue: 4 },
  { value: "5-10", label: "5-10 years", numericValue: 7 },
  { value: "10+", label: "10+ years", numericValue: 10 },
] as const;

export const VALIDATION_RULES = {
  MIN_SKILLS: 3,
  MIN_IDEAL_ROLE_CHARS: 50,
  MIN_JOB_TITLE_CHARS: 2,
} as const;

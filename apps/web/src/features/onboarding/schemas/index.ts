import { z } from "zod";

const basicInfoSchema = z.object({
  jobTitles: z.array(z.string()).min(1, "Please add at least one job title"),
  experienceLevel: z
    .array(z.enum(["junior", "mid", "senior", "c-level"]))
    .min(1, "Please select at least one experience level"),
  preferredLocations: z
    .array(z.enum(["remote", "hybrid", "office"]))
    .min(1, "Please select at least one work location"),
});

const skillsSchema = z.object({
  skills: z.array(z.string()).min(3, "Please select at least 3 skills"),
});

const idealRoleSchema = z.object({
  idealRoleDescription: z
    .string()
    .min(50, "Description must be at least 50 characters"),
});

export const onboardingSchema = basicInfoSchema
  .merge(skillsSchema)
  .merge(idealRoleSchema);

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

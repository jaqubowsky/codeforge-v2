import { z } from "zod";

const preferencesSchema = z.object({
  skills: z.array(z.string()).min(3, "Please select at least 3 skills"),
  experienceLevel: z
    .array(z.enum(["junior", "mid", "senior", "c-level"]))
    .min(1, "Please select at least one experience level"),
  preferredLocations: z
    .array(z.enum(["remote", "hybrid", "office"]))
    .min(1, "Please select at least one work location"),
});

const idealRoleSchema = z.object({
  idealRoleDescription: z.string(),
});

export const onboardingSchema = preferencesSchema.merge(idealRoleSchema);

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

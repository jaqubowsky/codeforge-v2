import { z } from "zod";

export const basicInfoSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  yearsExperience: z.enum(["0-1", "1-3", "3-5", "5-10", "10+"]),
});

export const skillsSchema = z.object({
  skills: z.array(z.string()).min(3, "Please select at least 3 skills"),
});

export const idealRoleSchema = z.object({
  idealRoleDescription: z
    .string()
    .min(50, "Description must be at least 50 characters"),
});

export const onboardingSchema = basicInfoSchema
  .merge(skillsSchema)
  .merge(idealRoleSchema);

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type SkillsFormData = z.infer<typeof skillsSchema>;
export type IdealRoleFormData = z.infer<typeof idealRoleSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;

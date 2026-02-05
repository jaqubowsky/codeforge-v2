import { z } from "zod";

export const profileSchema = z.object({
  jobTitles: z.array(z.string()).min(1, "Please add at least one job title"),
  experienceLevel: z
    .array(z.enum(["junior", "mid", "senior", "c-level"]))
    .min(1, "Please select at least one experience level"),
  preferredLocations: z
    .array(z.enum(["remote", "hybrid", "office"]))
    .min(1, "Please select at least one work location"),
  skills: z.array(z.string()).min(3, "Please select at least 3 skills"),
  idealRoleDescription: z
    .string()
    .min(50, "Description must be at least 50 characters"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

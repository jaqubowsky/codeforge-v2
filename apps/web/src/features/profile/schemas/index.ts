import { z } from "zod";

export const profileSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  yearsExperience: z.enum(["0-1", "1-3", "3-5", "5-10", "10+"]),
  skills: z.array(z.string()).min(3, "Please select at least 3 skills"),
  idealRoleDescription: z
    .string()
    .min(50, "Description must be at least 50 characters"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

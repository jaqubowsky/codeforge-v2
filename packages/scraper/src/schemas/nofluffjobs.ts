import { z } from "zod";

export const noFluffJobsProviderOptionsSchema = z.object({
  salaryCurrency: z.enum(["PLN", "USD", "EUR"]).optional(),
  salaryPeriod: z.enum(["month", "hour"]).optional(),
  region: z.string().optional(),
});

export type NoFluffJobsProviderOptions = z.infer<
  typeof noFluffJobsProviderOptionsSchema
>;

import { z } from "zod";

export const justJoinItProviderOptionsSchema = z.object({
  currency: z.enum(["pln", "usd", "eur"]).optional(),
  orderBy: z.enum(["ascending", "descending"]).optional(),
  sortBy: z.enum(["publishedAt", "salary"]).optional(),
  cityRadiusKm: z.coerce.number().positive().optional(),
});

export type JustJoinItProviderOptions = z.infer<
  typeof justJoinItProviderOptionsSchema
>;

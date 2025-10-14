import { z } from "zod";

export const justJoinItProviderOptionsSchema = z.object({
  currency: z.enum(["pln", "usd", "eur"]).optional(),
  orderBy: z.enum(["ASC", "DESC"]).optional(),
  sortBy: z.enum(["published", "salary"]).optional(),
  cityRadiusKm: z.coerce.number().positive().optional(),
});

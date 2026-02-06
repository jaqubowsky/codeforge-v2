import { z } from "zod";

export const baseProviderOptionsSchema = z.object({
  currency: z.enum(["pln", "usd", "eur"]).optional(),
  orderBy: z.enum(["ASC", "DESC"]).optional(),
  sortBy: z.enum(["publishedAt", "salary"]).optional(),
  cityRadiusKm: z.coerce.number().positive().optional(),
});

export * from "./justjoinit";
export * from "./nofluffjobs";

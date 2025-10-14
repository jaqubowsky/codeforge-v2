import { z } from "zod";
import { AVAILABLE_JOB_BOARDS } from "../types";
import { JUST_JOIN_IT_TECHNOLOGIES } from "../types/just-join-it";

export const baseOffersByTechnologyOptionsSchema = z.object({
  board: z.enum(AVAILABLE_JOB_BOARDS, {
    message: "Invalid job board",
  }),
  technology: z
    .enum(JUST_JOIN_IT_TECHNOLOGIES, {
      message: "Invalid technology",
    })
    .optional(),
});

export const baseOffersByTechnologyScrapingOptionsSchema = z.object({
  itemsPerPage: z.coerce.number().positive().optional(),
  maxOffers: z.coerce.number().positive().optional(),
  maxIterations: z.coerce.number().positive().optional(),
  concurrencyLimit: z.coerce.number().positive().optional(),
});

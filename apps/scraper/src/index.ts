import type { HttpFunction } from "@google-cloud/functions-framework";
import { z } from "zod";
import { getScrapingStrategy } from "./strategies";
import { ValidationError } from "./utils/errors";
import { scrapePage } from "./utils/page-scraper";
import { successResponse, withError } from "./utils/responses";

const VALID_DOMAINS = ["justjoin.it"] as const;

export const scrapeHandlerSchema = z.object({
  url: z
    .url()
    .refine(
      (url) =>
        VALID_DOMAINS.some((domain) => new URL(url).hostname.includes(domain)),
      { message: "Unsupported domain." }
    ),
});

export const scrapeHandler: HttpFunction = withError(async (req, res) => {
  const body = req.body;

  const result = scrapeHandlerSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error);
  }

  const strategy = getScrapingStrategy(result.data.url);
  const content = await scrapePage(result.data.url, strategy);

  return successResponse(res, {
    data: {
      content,
    },
  });
});

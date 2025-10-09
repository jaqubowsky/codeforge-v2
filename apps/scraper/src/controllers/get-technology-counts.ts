import type { HttpFunction } from "@google-cloud/functions-framework";
import { z } from "zod";
import { getScrapingStrategy } from "../strategies";
import { getBrowserContext, launchBrowser } from "../utils/browser-manager";
import { getErrorMessageFromZodError, ValidationError } from "../utils/errors";
import { successResponse, withError } from "../utils/responses";

export const getTechnologyCountsSchema = z.object({
  url: z.url({
    error: "Invalid URL",
  }),
});

export const getTechnologyCounts: HttpFunction = withError(async (req, res) => {
  const { url } = req.query;

  const result = getTechnologyCountsSchema.safeParse({ url });
  if (!result.success) {
    throw new ValidationError(getErrorMessageFromZodError(result.error));
  }

  const browser = await launchBrowser();

  try {
    const context = await getBrowserContext(browser);
    const page = await context.newPage();

    const strategy = getScrapingStrategy(result.data.url);
    const data = await strategy.getTechnologyCounts(page);

    return successResponse(res, { data });
  } finally {
    await browser.close();
  }
});

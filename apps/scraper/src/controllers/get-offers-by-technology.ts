import type { HttpFunction } from "@google-cloud/functions-framework";
import { z } from "zod";
import { getScrapingStrategy } from "../strategies";
import { getBrowserContext, launchBrowser } from "../utils/browser-manager";
import { getErrorMessageFromZodError, ValidationError } from "../utils/errors";
import { successResponse, withError } from "../utils/responses";

export const getOffersByTechnologySchema = z.object({
  url: z.url({
    error: "Invalid URL",
  }),
  technology: z.string({
    error: "Invalid technology",
  }),
});

export const getOffersByTechnology: HttpFunction = withError(
  async (req, res) => {
    const { url, technology } = req.query;

    const result = getOffersByTechnologySchema.safeParse({
      url,
      technology,
    });
    if (!result.success) {
      throw new ValidationError(getErrorMessageFromZodError(result.error));
    }

    const browser = await launchBrowser();

    try {
      const context = await getBrowserContext(browser);
      const page = await context.newPage();

      const strategy = getScrapingStrategy(result.data.url);
      const data = await strategy.getOffersByTechnology(
        page,
        result.data.technology
      );

      return successResponse(res, {
        data,
      });
    } finally {
      await browser.close();
    }
  }
);

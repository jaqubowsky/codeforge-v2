import type { HttpFunction } from "@google-cloud/functions-framework";
import { z } from "zod";
import { getScrapingStrategy } from "../strategies";
import { getBrowserContext, launchBrowser } from "../utils/browser-manager";
import { ValidationError } from "../utils/errors";
import { successResponse, withError } from "../utils/responses";

export const getOffersByTechnologySchema = z.object({
  url: z.url(),
  technology: z.string(),
});

export const getOffersByTechnology: HttpFunction = withError(
  async (req, res) => {
    const body = req.body;

    const result = getOffersByTechnologySchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError(result.error);
    }

    const browser = await launchBrowser();
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
  }
);

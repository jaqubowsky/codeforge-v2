import { queries } from "@codeforge-v2/database";
import type { HttpFunction } from "@google-cloud/functions-framework";
import { z } from "zod";
import { getScrapingStrategy } from "../strategies";
import { getBrowserContext, launchBrowser } from "../utils/browser-manager";
import {
  BadRequestError,
  getErrorMessageFromZodError,
  ValidationError,
} from "../utils/errors";
import { successResponse, withError } from "../utils/responses";

export const getOffersByTechnologySchema = z.object({
  url: z.url({
    message: "Invalid URL",
  }),
  technology: z.string({
    message: "Invalid technology",
  }),
});

export const getOffersByTechnology: HttpFunction = withError(
  async (req, res) => {
    const query = req.query;

    const result = getOffersByTechnologySchema.safeParse(query);
    if (!result.success) {
      throw new ValidationError(getErrorMessageFromZodError(result.error));
    }

    const { url, technology } = result.data;

    const { data: scrapingRun, error: runError } =
      await queries.scraping_runs.create({
        run_type: "offer_collection",
        search_keyword: technology,
        source_url: url,
        status: "running",
      });

    if (runError || !scrapingRun) {
      throw new BadRequestError("Failed to create scraping run");
    }

    const browser = await launchBrowser();

    try {
      const context = await getBrowserContext(browser);
      const page = await context.newPage();
      const strategy = getScrapingStrategy(url);
      const scrapedOffers = await strategy.getOffersByTechnology(
        page,
        technology
      );

      if (scrapedOffers.length === 0) {
        await queries.scraping_runs.update(scrapingRun.id, {
          status: "completed",
          offer_count: 0,
        });

        return successResponse(res, {
          message: "Scraping completed. No new offers found.",
          data: {
            runId: scrapingRun.id,
          },
        });
      }

      const offersToInsert = scrapedOffers.map((offer) => ({
        title: offer.title,
        company: offer.company,
        salary: offer.salary,
        offer_url: offer.url,
        description: offer.description,
        skills: offer.skills,
        scraping_run_id: scrapingRun.id,
      }));

      const { error: offersError } =
        await queries.offers.createMany(offersToInsert);

      if (offersError) {
        await queries.scraping_runs.update(scrapingRun.id, {
          status: "failed",
        });

        throw new BadRequestError(
          `Failed to save offers: ${offersError.message}`
        );
      }

      await queries.scraping_runs.update(scrapingRun.id, {
        status: "completed",
        offer_count: offersToInsert.length,
      });

      return successResponse(res, {
        message: `Successfully scraped and saved ${offersToInsert.length} offers.`,
        data: {
          runId: scrapingRun.id,
        },
      });
    } catch (error) {
      await queries.scraping_runs.update(scrapingRun.id, { status: "failed" });
      throw error;
    } finally {
      await browser.close();
    }
  }
);

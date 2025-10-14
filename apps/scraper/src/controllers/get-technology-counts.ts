import { queries, type TablesInsert } from "@codeforge-v2/database";
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

export const getTechnologyCountsSchema = z.object({
  url: z.url({
    message: "Invalid URL",
  }),
});

export const getTechnologyCounts: HttpFunction = withError(async (req, res) => {
  const result = getTechnologyCountsSchema.safeParse(req.query);
  if (!result.success) {
    throw new ValidationError(getErrorMessageFromZodError(result.error));
  }
  const { url } = result.data;

  const { data: scrapingRun, error: runError } =
    await queries.scraping_runs.create({
      run_type: "technology_counts",
      source_url: url,
      status: "running",
      search_keyword: null,
    });

  if (runError || !scrapingRun) {
    throw new BadRequestError("Failed to create scraping run");
  }

  const browser = await launchBrowser();
  try {
    const context = await getBrowserContext(browser);
    const page = await context.newPage();

    const strategy = getScrapingStrategy(url);
    const scrapedCounts = await strategy.getTechnologyCounts(page);

    if (scrapedCounts.length === 0) {
      await queries.scraping_runs.update(scrapingRun.id, {
        status: "completed",
      });
      return successResponse(res, {
        message: "Scraping completed. No technology counts were found.",
        data: { runId: scrapingRun.id },
      });
    }

    const countsToInsert: TablesInsert<"technology_counts">[] =
      scrapedCounts.map((item) => ({
        name: item.name,
        count: item.count,
        scraping_run_id: scrapingRun.id,
      }));

    const { error: countsError } =
      await queries.technology_counts.createMany(countsToInsert);

    if (countsError) {
      await queries.scraping_runs.update(scrapingRun.id, {
        status: "failed",
      });
      throw new BadRequestError(
        `Failed to save technology counts: ${countsError.message}`
      );
    }

    await queries.scraping_runs.update(scrapingRun.id, {
      status: "completed",
    });

    return successResponse(res, {
      message: `Successfully scraped and saved ${countsToInsert.length} technology counts.`,
      data: { runId: scrapingRun.id },
    });
  } catch (error) {
    await queries.scraping_runs.update(scrapingRun.id, { status: "failed" });
    throw error;
  } finally {
    await browser.close();
  }
});

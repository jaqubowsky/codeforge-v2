import { ScrapingService } from "../services/scraping.service";
import { getScrapingStrategy } from "../strategies/strategy-factory";
import type {
  JobBoard,
  ScrapeOffersOptions,
  ScrapeOffersResult,
} from "../types/scraper-types";
import { getErrorMessage } from "../utils/errors";

const DEFAULT_BOARD: JobBoard = "justjoinit";
const DEFAULT_MAX_OFFERS = 500;

/**
 * Scrapes job offers and saves ALL of them to the database
 *
 * This is the main entry point for scraping. It fetches offers from
 * the job board, generates embeddings, and saves ALL to the offers table.
 *
 * Filtering by user preferences happens separately via the matchJobs
 * function, which saves matching offers to the user_offers table.
 *
 * This approach allows multiple users to share the same pool of scraped
 * offers, improving matching results for everyone.
 *
 * @param options - Scraping options (board, maxOffers)
 * @returns Result with success status and counts
 */
export async function scrapeOffers(
  options?: ScrapeOffersOptions
): Promise<ScrapeOffersResult> {
  const { board = DEFAULT_BOARD, maxOffers = DEFAULT_MAX_OFFERS } =
    options ?? {};

  try {
    const strategy = getScrapingStrategy(board, {
      maxOffers,
      maxIterations: Math.ceil(maxOffers / 100),
    });

    const scrapingService = new ScrapingService(strategy);

    const result = await scrapingService.scrapeOffersByTechnology(undefined);

    return {
      success: true,
      runId: result.runId,
      offersCount: result.offersCount,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

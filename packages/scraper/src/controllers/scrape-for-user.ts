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

export async function scrapeOffers(
  options?: ScrapeOffersOptions
): Promise<ScrapeOffersResult> {
  const {
    board = DEFAULT_BOARD,
    maxOffers = DEFAULT_MAX_OFFERS,
    categories,
  } = options ?? {};

  try {
    const strategy = getScrapingStrategy(board, {
      maxOffers,
      maxIterations: Math.ceil(maxOffers / 100),
    });

    const scrapingService = new ScrapingService(strategy);
    const result = await scrapingService.scrapeOffers(
      (categories ?? []) as never[]
    );

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

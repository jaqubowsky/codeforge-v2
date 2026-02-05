import { ScrapingService } from "../services/scraping.service";
import { getScrapingStrategy } from "../strategies/strategy-factory";
import type {
  JobBoard,
  ScrapeForUserOptions,
  ScrapeForUserResult,
} from "../types/scraper-types";
import { getErrorMessage } from "../utils/errors";
import { filterBySkills } from "../utils/filter-by-skills";

const DEFAULT_BOARD: JobBoard = "justjoinit";
const DEFAULT_MAX_OFFERS = 500;

/**
 * Scrapes job offers and filters them by user skills
 *
 * This is the main entry point for user-triggered scraping.
 * It fetches offers from the job board, filters by user skills,
 * generates embeddings, and saves to database.
 *
 * @param options - Scraping options including user skills
 * @returns Result with success status and counts
 */
export async function scrapeForUser(
  options: ScrapeForUserOptions
): Promise<ScrapeForUserResult> {
  const {
    userSkills,
    board = DEFAULT_BOARD,
    maxOffers = DEFAULT_MAX_OFFERS,
  } = options;

  if (!userSkills || userSkills.length === 0) {
    return {
      success: false,
      error: "No skills provided for filtering",
    };
  }

  try {
    const strategy = getScrapingStrategy(board, {
      maxOffers,
      maxIterations: Math.ceil(maxOffers / 100),
    });

    const scrapingService = new ScrapingService(strategy);

    const result = await scrapingService.scrapeAndFilterBySkills(
      undefined, // No technology filter - scrape all and filter post-fetch
      userSkills,
      filterBySkills
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

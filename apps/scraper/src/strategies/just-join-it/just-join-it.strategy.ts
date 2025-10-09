import type { BrowserContext, Page } from "playwright-core";
import type {
  Offer,
  OfferWithoutDescriptionAndSkills,
  Technology,
} from "../../types";
import { executeInBatches } from "../../utils/batch-processor";
import type { ScrapingStrategy } from "../strategy";
import { JustJoinItPage } from "./just-join-it.page.pom";
import { JustJoinItOfferPage } from "./just-join-it-offer-page.pom";

const CONCURRENCY_LIMIT = 5;
const BASE_URL = "https://justjoin.it";

export class JustJoinItStrategy implements ScrapingStrategy {
  private readonly processOffer = async (
    context: BrowserContext,
    offer: OfferWithoutDescriptionAndSkills
  ): Promise<Offer | null> => {
    const offerPageInstance = await context.newPage();

    try {
      await offerPageInstance.goto(offer.url);

      const offerPage = new JustJoinItOfferPage(offerPageInstance);
      const description = await offerPage.getJobDescription();
      const skills = await offerPage.getTechStack();

      return {
        ...offer,
        description,
        skills,
      };
    } finally {
      await offerPageInstance.close();
    }
  };

  async getOffersByTechnology(
    page: Page,
    technology: string
  ): Promise<Offer[]> {
    await page.goto(`${BASE_URL}/job-offers/all-locations/${technology}`);

    const justJoinItPage = new JustJoinItPage(page);

    await page.waitForLoadState("networkidle");
    await justJoinItPage.handleCookies();

    const offers = await justJoinItPage.getOffers();
    const context = page.context();

    const detailedOffers = await executeInBatches(
      offers,
      (offer) => this.processOffer(context, offer),
      CONCURRENCY_LIMIT
    );

    return detailedOffers;
  }

  async getTechnologyCounts(page: Page): Promise<Technology[]> {
    await page.goto(BASE_URL);

    const justJoinItPage = new JustJoinItPage(page);

    await justJoinItPage.handleCookies();
    return await justJoinItPage.getTechnologyCounts();
  }
}

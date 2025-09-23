import type { Page } from "playwright";
import type { Offer, OfferWithoutDescriptionAndSkills } from "../../types";
import { executeInBatches } from "../../utils/batch-processor";
import type { ScrapingStrategy } from "../strategy";
import { JustJoinItPage } from "./just-join-it.page.pom";
import { JustJoinItOfferPage } from "./just-join-it-offer-page.pom";

const CONCURRENCY_LIMIT = 5;

export class JustJoinItStrategy implements ScrapingStrategy {
  async execute(page: Page) {
    const justJoinItPage = new JustJoinItPage(page);
    await justJoinItPage.handleCookies();
    await justJoinItPage.scrollToEndOfList();
    const offers = await justJoinItPage.getOffers();

    const context = page.context();

    const processOffer = async (
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

    const detailedOffers = await executeInBatches(
      offers,
      processOffer,
      CONCURRENCY_LIMIT
    );

    return detailedOffers;
  }
}

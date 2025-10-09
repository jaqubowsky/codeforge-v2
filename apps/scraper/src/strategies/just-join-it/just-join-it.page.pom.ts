import type { Locator, Page } from "playwright-core";
import type { OfferWithoutDescriptionAndSkills, Technology } from "../../types";
import { getAttribute, getText, safeWaitFor } from "../../utils/poms";
import { SELECTORS } from "./selectors";

const WAIT_TIME_ONE_SECOND_MS = 1000;

export class JustJoinItPage {
  readonly page: Page;
  readonly baseUrl: string;
  readonly offersList: Locator;
  readonly cookieAcceptButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = new URL(page.url()).origin;
    this.offersList = page.locator(SELECTORS.listPage.base);
    this.cookieAcceptButton = page.locator("#cookiescript_accept");
  }

  private async getOfferDetails(
    item: Locator
  ): Promise<OfferWithoutDescriptionAndSkills> {
    const title = await getText(
      item,
      SELECTORS.listPage.children.offerItemChildren.title
    );
    const company = await getText(
      item,
      SELECTORS.listPage.children.offerItemChildren.company
    );
    const salary = await getText(
      item,
      SELECTORS.listPage.children.offerItemChildren.salary
    );

    const url = await getAttribute(
      item,
      SELECTORS.listPage.children.offerItemChildren.url,
      "href"
    );
    const fullUrl = `${this.baseUrl}${url}`;

    return {
      title,
      company,
      salary,
      url: fullUrl,
    };
  }

  async getOffers(): Promise<OfferWithoutDescriptionAndSkills[]> {
    const offerItems = await this.offersList
      .locator(SELECTORS.listPage.children.offerItem)
      .all();

    const offers = await Promise.allSettled(
      offerItems.map((item) => this.getOfferDetails(item))
    );

    return offers
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
  }

  async getTechnologyCounts(): Promise<Technology[]> {
    const techListExists = await safeWaitFor(
      this.page,
      SELECTORS.technologiesList.base
    );

    if (!techListExists) {
      throw new Error(
        "Technologies list not found - check technologiesList.base selector"
      );
    }

    const techList = this.page.locator(SELECTORS.technologiesList.base);

    const techItems = await techList
      .locator(SELECTORS.technologiesList.children.technologyItem)
      .all();

    const technologies = await Promise.all(
      techItems.map(async (item) => {
        const name = (
          await getText(
            item,
            SELECTORS.technologiesList.children.techItemChildren.technologyName
          )
        )
          .trim()
          .toLowerCase();

        const countText = await getText(
          item,
          SELECTORS.technologiesList.children.techItemChildren.technologyCount
        );

        const count = Number.parseInt(countText.trim(), 10);
        return { name, count };
      })
    );

    return technologies.filter((tech) => tech.name);
  }

  async handleCookies() {
    const acceptButton = this.cookieAcceptButton;

    try {
      await acceptButton.waitFor({
        timeout: WAIT_TIME_ONE_SECOND_MS * 2,
      });

      const isButtonVisible = await acceptButton.isVisible();
      if (!isButtonVisible) {
        return;
      }

      await acceptButton.click();
    } catch {
      // It's okay if the cookie banner is not found
    }
  }
}

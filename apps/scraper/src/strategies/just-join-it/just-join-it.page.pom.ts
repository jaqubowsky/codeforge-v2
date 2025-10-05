import type { Locator, Page } from "playwright";
import type { OfferWithoutDescriptionAndSkills, Technology } from "../../types";
import { getAttribute, getText, scrollDown } from "../../utils/poms";
import { SELECTORS } from "./selectors";

const COOKIE_ACCEPT_REGEX = /^(Accept|Agree|Allow all)$/i;
const WAIT_FOR_NEW_CONTENT_MS = 5000;
const MAX_SCROLL_ATTEMPTS = 50;

export class JustJoinItPage {
  readonly page: Page;
  readonly url: string;
  readonly offersList: Locator;
  readonly cookieAcceptButton: Locator;
  readonly technologiesList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.url = page.url();
    this.offersList = page.locator(SELECTORS.listPage().toString());
    this.cookieAcceptButton = page
      .locator("button")
      .filter({
        hasText: COOKIE_ACCEPT_REGEX,
      })
      .first();
    this.technologiesList = page.locator(
      SELECTORS.technologiesList().toString()
    );
  }

  private async waitForInitialElements() {
    await this.offersList.waitFor();
    await this.offersList
      .locator(SELECTORS.listPage().offerItem().toString())
      .first()
      .waitFor();
  }

  private async getOfferItemsCount(): Promise<number> {
    return await this.offersList
      .locator(SELECTORS.listPage().offerItem().toString())
      .count();
  }

  private async waitForNewOfferItems(previousCount: number): Promise<boolean> {
    try {
      const selectorParam = `${SELECTORS.listPage().offersList().toString()} ${SELECTORS.listPage().offerItem().toString()}`;

      await this.page.waitForFunction(
        ({ selector, count }) =>
          document.querySelectorAll(selector).length > count,
        { selector: selectorParam, count: previousCount },
        { timeout: WAIT_FOR_NEW_CONTENT_MS }
      );

      return true;
    } catch {
      return false;
    }
  }

  async scrollToEndOfList() {
    await this.waitForInitialElements();

    let previousCount = 0;

    for (let i = 0; i < MAX_SCROLL_ATTEMPTS; i++) {
      const currentCount = await this.getOfferItemsCount();

      if (i > 0 && currentCount === previousCount) {
        break;
      }

      previousCount = currentCount;
      await scrollDown(this.page);

      const newItemsLoaded = await this.waitForNewOfferItems(previousCount);
      if (!newItemsLoaded) {
        break;
      }
    }
  }

  private async getOfferDetails(
    item: Locator
  ): Promise<OfferWithoutDescriptionAndSkills> {
    const title = await getText(item, SELECTORS.listPage().title().toString());
    const company = await getText(
      item,
      SELECTORS.listPage().company().toString()
    );
    const salary = await getText(
      item,
      SELECTORS.listPage().salary().toString()
    );
    const url = await getAttribute(
      item,
      SELECTORS.listPage().url().toString(),
      "href"
    );

    return {
      title,
      company,
      salary,
      url: `${this.url}${url}`,
    };
  }

  async getOffers(): Promise<OfferWithoutDescriptionAndSkills[]> {
    const offerItems = await this.offersList
      .locator(SELECTORS.listPage().offerItem().toString())
      .all();

    const offers = await Promise.all(
      offerItems.map((item) => this.getOfferDetails(item))
    );
    return offers;
  }

  async getTechnologyCounts(): Promise<Technology[]> {
    await this.technologiesList.waitFor();
    const techItems = await this.technologiesList
      .locator(SELECTORS.technologiesList().technologyItem().toString())
      .all();

    const technologies = await Promise.all(
      techItems.map(async (item) => {
        const name = (
          await getText(
            item,
            SELECTORS.technologiesList().technologyName().toString()
          )
        )
          .trim()
          .toLowerCase();
        const countText = await getText(
          item,
          SELECTORS.technologiesList().technologyCount().toString()
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
      await acceptButton.waitFor({ timeout: 5000 });
      if (await acceptButton.isVisible()) {
        await acceptButton.click();
      }
    } catch {
      // It's okay if the cookie banner is not found
    }
  }
}

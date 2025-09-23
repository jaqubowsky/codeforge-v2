import type { Locator, Page } from "playwright";
import type { OfferWithoutDescriptionAndSkills } from "../../types";
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

  constructor(page: Page) {
    this.page = page;
    this.url = page.url();
    this.offersList = page.locator(SELECTORS.listPage.offersList);
    this.cookieAcceptButton = page
      .locator("button")
      .filter({
        hasText: COOKIE_ACCEPT_REGEX,
      })
      .first();
  }

  private async waitForInitialElements() {
    await this.offersList.waitFor();
    await this.offersList
      .locator(SELECTORS.listPage.offerItem)
      .first()
      .waitFor();
  }

  private async getOfferItemsCount(): Promise<number> {
    return await this.offersList.locator(SELECTORS.listPage.offerItem).count();
  }

  private async waitForNewOfferItems(previousCount: number): Promise<boolean> {
    try {
      const selectorParam = `${SELECTORS.listPage.offersList} ${SELECTORS.listPage.offerItem}`;

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
    const title = await getText(item, SELECTORS.listPage.title);
    const company = await getText(item, SELECTORS.listPage.company);
    const salary = await getText(item, SELECTORS.listPage.salary);
    const url = await getAttribute(item, SELECTORS.listPage.url, "href");

    return {
      title,
      company,
      salary,
      url: `${this.url}${url}`,
    };
  }

  async getOffers(): Promise<OfferWithoutDescriptionAndSkills[]> {
    const offerItems = await this.offersList
      .locator(SELECTORS.listPage.offerItem)
      .all();

    const offers = await Promise.all(
      offerItems.map((item) => this.getOfferDetails(item))
    );
    return offers;
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

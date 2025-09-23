"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JustJoinItPage = void 0;
const utils_1 = require("./utils");
const SELECTORS = {
    OFFERS_LIST: "#up-offers-list",
    OFFER_ITEM: "li",
    TITLE: "h3",
    COMPANY: '[data-testid="ApartmentRoundedIcon"] + p',
    SALARY: "span.MuiTypography-lead3",
    TECHNOLOGIES: "div.MuiBox-root.mui-1hs2dk6",
    URL: "a.offer-card",
};
const COOKIE_ACCEPT_REGEX = /^(Accept|Agree|Allow all)$/i;
const WAIT_FOR_NEW_CONTENT_MS = 5000;
const MAX_SCROLL_ATTEMPTS = 50;
class JustJoinItPage {
    page;
    url;
    offersList;
    cookieAcceptButton;
    constructor(page) {
        this.page = page;
        this.url = page.url();
        this.offersList = page.locator(SELECTORS.OFFERS_LIST);
        this.cookieAcceptButton = page
            .locator("button")
            .filter({
            hasText: COOKIE_ACCEPT_REGEX,
        })
            .first();
    }
    async waitForInitialElements() {
        await this.offersList.waitFor();
        await this.offersList.locator(SELECTORS.OFFER_ITEM).first().waitFor();
    }
    async getOfferItemsCount() {
        return await this.offersList.locator(SELECTORS.OFFER_ITEM).count();
    }
    async waitForNewOfferItems(previousCount) {
        try {
            const selectorParam = `${SELECTORS.OFFERS_LIST} ${SELECTORS.OFFER_ITEM}`;
            await this.page.waitForFunction(({ selector, count }) => document.querySelectorAll(selector).length > count, { selector: selectorParam, count: previousCount }, { timeout: WAIT_FOR_NEW_CONTENT_MS });
            return true;
        }
        catch {
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
            await (0, utils_1.scrollDown)(this.page);
            const newItemsLoaded = await this.waitForNewOfferItems(previousCount);
            if (!newItemsLoaded) {
                break;
            }
        }
    }
    async getOfferDetails(item) {
        const title = await (0, utils_1.getText)(item, SELECTORS.TITLE);
        const company = await (0, utils_1.getText)(item, SELECTORS.COMPANY);
        const salary = await (0, utils_1.getText)(item, SELECTORS.SALARY);
        const url = await (0, utils_1.getAttribute)(item, SELECTORS.URL, "href");
        return {
            title,
            company,
            salary,
            url: `${this.url}${url}`,
        };
    }
    async getOffers() {
        const offerItems = await this.offersList
            .locator(SELECTORS.OFFER_ITEM)
            .all();
        const offers = await Promise.all(offerItems.map((item) => this.getOfferDetails(item)));
        return offers;
    }
    async handleCookies() {
        const acceptButton = this.cookieAcceptButton;
        try {
            await acceptButton.waitFor({ timeout: 5000 });
            if (await acceptButton.isVisible()) {
                await acceptButton.click();
            }
        }
        catch {
            // It's okay if the cookie banner is not found
        }
    }
}
exports.JustJoinItPage = JustJoinItPage;

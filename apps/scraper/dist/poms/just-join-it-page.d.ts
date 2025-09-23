import type { Locator, Page } from "playwright";
import type { OfferWithoutDescriptionAndSkills } from "../types";
export declare class JustJoinItPage {
    readonly page: Page;
    readonly url: string;
    readonly offersList: Locator;
    readonly cookieAcceptButton: Locator;
    constructor(page: Page);
    private waitForInitialElements;
    private getOfferItemsCount;
    private waitForNewOfferItems;
    scrollToEndOfList(): Promise<void>;
    private getOfferDetails;
    getOffers(): Promise<OfferWithoutDescriptionAndSkills[]>;
    handleCookies(): Promise<void>;
}
//# sourceMappingURL=just-join-it-page.d.ts.map
import type { Page } from "playwright";
export declare class DefaultPage {
    readonly page: Page;
    constructor(page: Page);
    waitForLoadState(): Promise<void>;
    getHtmlContent(): Promise<string>;
}
//# sourceMappingURL=default-page.d.ts.map
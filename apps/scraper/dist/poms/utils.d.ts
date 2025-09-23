import type { Locator, Page } from "playwright";
export declare const scrollDown: (page: Page, scrollDistance?: number) => Promise<void>;
export declare const getText: (locator: Locator, selector: string) => Promise<string>;
export declare const getAttribute: (locator: Locator, selector: string, attribute: string) => Promise<string>;
//# sourceMappingURL=utils.d.ts.map
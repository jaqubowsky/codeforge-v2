import type { Page } from "playwright";
import type { ScrapingStrategy } from "./strategy";
export declare class DefaultStrategy implements ScrapingStrategy {
    execute(page: Page): Promise<void>;
    getHtmlContent(page: Page): Promise<string>;
}
//# sourceMappingURL=default-strategy.d.ts.map
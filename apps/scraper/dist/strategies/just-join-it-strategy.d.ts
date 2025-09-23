import type { Page } from "playwright";
import type { Offer } from "../types";
import type { ScrapingStrategy } from "./strategy";
export declare class JustJoinItStrategy implements ScrapingStrategy {
    execute(page: Page): Promise<Offer[]>;
}
//# sourceMappingURL=just-join-it-strategy.d.ts.map
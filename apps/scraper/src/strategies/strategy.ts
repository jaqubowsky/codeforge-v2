import type { Page } from "playwright";
import type { Offer } from "../types";

export type ScrapingStrategy = {
  execute(page: Page): Promise<Offer[]>;
};

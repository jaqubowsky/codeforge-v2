import type { Page } from "playwright-core";
import type { Offer, Technology } from "../types";

export type ScrapingStrategy = {
  getOffersByTechnology(page: Page, technology: string): Promise<Offer[]>;
  getTechnologyCounts(page: Page): Promise<Technology[]>;
};

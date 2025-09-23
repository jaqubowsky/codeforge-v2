import type { ScrapingStrategy } from "../strategies/strategy";
import type { Offer } from "../types";
import { closeBrowser, launchBrowser } from "./browser-manager";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";

const EXTRA_HTTP_HEADERS = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.google.com/",
};

export const scrapePage = async (
  url: string,
  strategy: ScrapingStrategy
): Promise<Offer[]> => {
  const browser = await launchBrowser();
  try {
    const context = await browser.newContext({
      userAgent: USER_AGENT,
      extraHTTPHeaders: EXTRA_HTTP_HEADERS,
    });

    const page = await context.newPage();
    await page.goto(url);

    const content = await strategy.execute(page);

    return content;
  } finally {
    await closeBrowser(browser);
  }
};

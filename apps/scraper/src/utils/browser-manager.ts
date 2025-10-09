import chromium from "@sparticuz/chromium";
import type { Browser, BrowserContext } from "playwright-core";
import { chromium as playwrightChromium } from "playwright-core";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const EXTRA_HTTP_HEADERS = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.google.com/",
};

export const launchBrowser = async (): Promise<Browser> => {
  const executablePath = await chromium.executablePath;

  const launchOptions = executablePath
    ? {
        executablePath,
        args: chromium.args,
      }
    : {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      };

  const browser = await playwrightChromium.launch(launchOptions);

  return browser;
};

export const closeBrowser = async (browser: Browser | null): Promise<void> => {
  if (browser?.isConnected()) {
    await browser.close();
  }
};

export const getBrowserContext = async (
  browser: Browser
): Promise<BrowserContext> => {
  return await browser.newContext({
    userAgent: USER_AGENT,
    extraHTTPHeaders: EXTRA_HTTP_HEADERS,
  });
};

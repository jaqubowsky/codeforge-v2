import { type Browser, chromium } from "playwright";

export const launchBrowser = async (): Promise<Browser> => {
  return await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
};

export const closeBrowser = async (browser: Browser | null): Promise<void> => {
  if (browser?.isConnected()) {
    await browser.close();
  }
};

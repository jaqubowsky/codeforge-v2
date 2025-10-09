import * as fs from "node:fs";
import * as path from "node:path";
import type { Locator, Page } from "playwright-core";

const WAIT_TIME_WAIT_FOR_MS = 5000;
const SCREENSHOTS_DIR = path.join(process.cwd(), "screenshots");

export const getText = async (
  locator: Locator,
  selector: string
): Promise<string> => {
  const text = await locator.locator(selector).textContent();
  return text?.trim() ?? "";
};

export const getAttribute = async (
  locator: Locator,
  selector: string,
  attribute: string
): Promise<string> => {
  const value = await locator.locator(selector).getAttribute(attribute);
  return value ?? "";
};

/**
 * Takes a debug screenshot and saves it to the screenshots directory
 */
export const takeDebugScreenshot = async (
  page: Page,
  name: string
): Promise<void> => {
  try {
    // Create screenshots directory if it doesn't exist
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${timestamp}_${name}.png`;
    const filepath = path.join(SCREENSHOTS_DIR, filename);

    await page.screenshot({ path: filepath, fullPage: true });

    // biome-ignore lint/suspicious/noConsole: learning purposes
    console.log(`[Debug] Screenshot saved: ${filepath}`);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: learning purposes
    console.error(`[Debug] Failed to save screenshot: ${error}`);
  }
};

export const safeWaitFor = async (
  pageOrLocator: Page | Locator,
  selector: string,
  timeout = WAIT_TIME_WAIT_FOR_MS
): Promise<boolean> => {
  try {
    await pageOrLocator
      .locator(selector)
      .waitFor({ timeout, state: "attached" });
    return true;
  } catch {
    if ("screenshot" in pageOrLocator) {
      await takeDebugScreenshot(
        pageOrLocator as Page,
        `element-not-found_${selector.replace(/[^a-zA-Z0-9]/g, "_")}`
      );
    }

    // biome-ignore lint/suspicious/noConsole: learning purposes
    console.warn(
      `[Selector Warning] Element "${selector}" not found within ${timeout}ms. Consider updating the selector.`
    );
    return false;
  }
};

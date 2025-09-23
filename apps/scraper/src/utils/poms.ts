import type { Locator, Page } from "playwright";

const WAIT_FOR_SCROLL_TIME_MS = 5000;
const SCROLL_DISTANCE = 5000;

export const scrollDown = async (
  page: Page,
  scrollDistance = SCROLL_DISTANCE
) => {
  await page.evaluate((distance) => {
    window.scrollBy(0, distance);
  }, scrollDistance);

  await page.waitForTimeout(WAIT_FOR_SCROLL_TIME_MS);
};

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

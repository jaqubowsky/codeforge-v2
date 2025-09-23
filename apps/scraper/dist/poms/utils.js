"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttribute = exports.getText = exports.scrollDown = void 0;
const WAIT_FOR_SCROLL_TIME_MS = 5000;
const SCROLL_DISTANCE = 5000;
const scrollDown = async (page, scrollDistance = SCROLL_DISTANCE) => {
    await page.evaluate((distance) => {
        window.scrollBy(0, distance);
    }, scrollDistance);
    await page.waitForTimeout(WAIT_FOR_SCROLL_TIME_MS);
};
exports.scrollDown = scrollDown;
const getText = async (locator, selector) => {
    const text = await locator.locator(selector).textContent();
    return text?.trim() ?? "";
};
exports.getText = getText;
const getAttribute = async (locator, selector, attribute) => {
    const value = await locator.locator(selector).getAttribute(attribute);
    return value ?? "";
};
exports.getAttribute = getAttribute;

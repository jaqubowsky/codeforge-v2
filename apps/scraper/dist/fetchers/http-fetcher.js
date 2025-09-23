"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUrl = void 0;
const playwright_1 = require("playwright");
const strategies_1 = require("../strategies");
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
const EXTRA_HTTP_HEADERS = {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.google.com/",
};
const fetchUrl = async (url) => {
    const browser = await playwright_1.chromium.launch();
    const context = await browser.newContext({
        userAgent: USER_AGENT,
        extraHTTPHeaders: EXTRA_HTTP_HEADERS,
    });
    const page = await context.newPage();
    await page.goto(url);
    const strategy = (0, strategies_1.getScrapingStrategy)(url);
    const data = await strategy.execute(page);
    await browser.close();
    return data;
};
exports.fetchUrl = fetchUrl;

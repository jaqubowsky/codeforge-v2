"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapePage = void 0;
const strategies_1 = require("../strategies");
const browser_manager_1 = require("./browser-manager");
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
const EXTRA_HTTP_HEADERS = {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.google.com/",
};
const scrapePage = async (url) => {
    const browser = await (0, browser_manager_1.launchBrowser)();
    try {
        const context = await browser.newContext({
            userAgent: USER_AGENT,
            extraHTTPHeaders: EXTRA_HTTP_HEADERS,
        });
        const page = await context.newPage();
        await page.goto(url);
        const strategy = (0, strategies_1.getScrapingStrategy)(url);
        const content = await strategy.execute(page);
        return content;
    }
    finally {
        await (0, browser_manager_1.closeBrowser)(browser);
    }
};
exports.scrapePage = scrapePage;

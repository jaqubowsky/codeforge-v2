"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeBrowser = exports.launchBrowser = void 0;
const playwright_1 = require("playwright");
const launchBrowser = async () => {
    return await playwright_1.chromium.launch();
};
exports.launchBrowser = launchBrowser;
const closeBrowser = async (browser) => {
    if (browser?.isConnected()) {
        await browser.close();
    }
};
exports.closeBrowser = closeBrowser;

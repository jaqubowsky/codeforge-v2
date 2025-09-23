"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultStrategy = void 0;
const default_page_1 = require("../poms/default-page");
class DefaultStrategy {
    async execute(page) {
        const defaultPage = new default_page_1.DefaultPage(page);
        await defaultPage.waitForLoadState();
    }
    async getHtmlContent(page) {
        const defaultPage = new default_page_1.DefaultPage(page);
        return await defaultPage.getHtmlContent();
    }
}
exports.DefaultStrategy = DefaultStrategy;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPage = void 0;
class DefaultPage {
    page;
    constructor(page) {
        this.page = page;
    }
    async waitForLoadState() {
        await this.page.waitForLoadState("networkidle");
    }
    async getHtmlContent() {
        return await this.page.content();
    }
}
exports.DefaultPage = DefaultPage;

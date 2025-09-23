"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JustJoinItOfferPage = void 0;
const utils_1 = require("./utils");
const OFFER_DETAILS_SELECTORS = {
    DESCRIPTION: 'h3:has-text("Job description") + div',
    TECH_STACK_ITEM: 'h2:has-text("Tech stack") + div ul > div',
    TECH_STACK_NAME: "h4",
    TECH_STACK_LEVEL: "span.MuiTypography-subtitle4",
};
class JustJoinItOfferPage {
    page;
    descriptionElement;
    techStackItems;
    constructor(page) {
        this.page = page;
        this.descriptionElement = page.locator(OFFER_DETAILS_SELECTORS.DESCRIPTION);
        this.techStackItems = page.locator(OFFER_DETAILS_SELECTORS.TECH_STACK_ITEM);
    }
    async getSkillDetails(item) {
        const name = await (0, utils_1.getText)(item, OFFER_DETAILS_SELECTORS.TECH_STACK_NAME);
        const level = await (0, utils_1.getText)(item, OFFER_DETAILS_SELECTORS.TECH_STACK_LEVEL);
        return { name, level };
    }
    async getTechStack() {
        const techStackItems = await this.techStackItems.all();
        const skills = await Promise.all(techStackItems.map((item) => this.getSkillDetails(item)));
        return skills;
    }
    async getJobDescription() {
        const descriptionElement = this.descriptionElement;
        await descriptionElement.waitFor();
        return descriptionElement.innerHTML();
    }
}
exports.JustJoinItOfferPage = JustJoinItOfferPage;

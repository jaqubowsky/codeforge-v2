import type { Locator, Page } from "playwright";
type Skill = {
    name: string;
    level: string;
};
export declare class JustJoinItOfferPage {
    readonly page: Page;
    readonly descriptionElement: Locator;
    readonly techStackItems: Locator;
    constructor(page: Page);
    private getSkillDetails;
    getTechStack(): Promise<Skill[]>;
    getJobDescription(): Promise<string>;
}
export {};
//# sourceMappingURL=just-join-it-offer-page.d.ts.map
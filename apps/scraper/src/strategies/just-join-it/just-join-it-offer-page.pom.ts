import type { Locator, Page } from "playwright";
import { getText } from "../../utils/poms";
import { SELECTORS } from "./selectors";

type Skill = { name: string; level: string };

export class JustJoinItOfferPage {
  readonly page: Page;
  readonly descriptionElement: Locator;
  readonly techStackItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.descriptionElement = page.locator(SELECTORS.offerPage.description);
    this.techStackItems = page.locator(SELECTORS.offerPage.techStackItem);
  }

  private async getSkillDetails(item: Locator): Promise<Skill> {
    const name = await getText(item, SELECTORS.offerPage.techStackName);
    const level = await getText(item, SELECTORS.offerPage.techStackLevel);

    return { name, level };
  }

  async getTechStack(): Promise<Skill[]> {
    const techStackItems = await this.techStackItems.all();

    const skills = await Promise.all(
      techStackItems.map((item) => this.getSkillDetails(item))
    );

    return skills;
  }

  async getJobDescription(): Promise<string> {
    const descriptionElement = this.descriptionElement;
    await descriptionElement.waitFor();
    return descriptionElement.innerHTML();
  }
}

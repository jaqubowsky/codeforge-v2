import type { Locator, Page } from "playwright-core";
import type { Skill } from "../../types";
import { getText } from "../../utils/poms";
import { SELECTORS } from "./selectors";

export class JustJoinItOfferPage {
  readonly page: Page;
  readonly descriptionElement: Locator;
  readonly techStackItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.descriptionElement = page.locator(
      SELECTORS.offerPage().description().toString()
    );
    this.techStackItems = page.locator(
      SELECTORS.offerPage().techStackItem().toString()
    );
  }

  private async getSkillDetails(item: Locator): Promise<Skill> {
    const name = await getText(
      item,
      SELECTORS.offerPage().techStackName().toString()
    );
    const level = await getText(
      item,
      SELECTORS.offerPage().techStackLevel().toString()
    );

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

import type { Locator, Page } from "playwright-core";
import type { Skill } from "../../types";
import { getText, safeWaitFor } from "../../utils/poms";
import { SELECTORS } from "./selectors";

export class JustJoinItOfferPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private async getSkillDetails(item: Locator): Promise<Skill> {
    const name = await getText(
      item,
      SELECTORS.offerPage.children.techStackContainerChildren
        .techStackItemChildren.techStackName
    );
    const level = await getText(
      item,
      SELECTORS.offerPage.children.techStackContainerChildren
        .techStackItemChildren.techStackLevel
    );

    return { name, level };
  }

  async getTechStack(): Promise<Skill[]> {
    const exists = await safeWaitFor(
      this.page,
      SELECTORS.offerPage.children.techStackContainer
    );

    if (!exists) {
      return [];
    }

    const techStackItems = await this.page
      .locator(
        SELECTORS.offerPage.children.techStackContainerChildren.techStackItem
      )
      .all();

    const skills = await Promise.all(
      techStackItems.map((item) => this.getSkillDetails(item))
    );

    return skills;
  }

  async getJobDescription(): Promise<string> {
    const exists = await safeWaitFor(
      this.page,
      SELECTORS.offerPage.children.description
    );

    if (!exists) {
      return "";
    }

    return await this.page
      .locator(SELECTORS.offerPage.children.description)
      .innerHTML();
  }
}

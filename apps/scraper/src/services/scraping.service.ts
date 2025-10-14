// biome-ignore-all lint/suspicious/noConsole: observability

import { queries } from "@codeforge-v2/database";
import type {
  Offer,
  PreparedOfferData,
  ScrapeOffersByTechnologyResult,
  ScrapingStrategy,
  TechnologyLink,
} from "../types";
import { BadRequestError, getErrorMessage } from "../utils/errors";

export class ScrapingService<TTechnology = string | undefined> {
  private readonly strategy: ScrapingStrategy<TTechnology>;

  constructor(strategy: ScrapingStrategy<TTechnology>) {
    this.strategy = strategy;
  }
  private collectUniqueTechnologyNames(
    preparedData: PreparedOfferData[]
  ): Set<string> {
    const uniqueTechNames = new Set<string>();
    for (const data of preparedData) {
      if (data.technologies) {
        for (const tech of data.technologies) {
          uniqueTechNames.add(tech.technology_name);
        }
      }
    }
    return uniqueTechNames;
  }

  private async fetchTechnologyIds(
    techNames: Set<string>
  ): Promise<Map<string, number>> {
    const techNameToId = new Map<string, number>();
    await Promise.all(
      Array.from(techNames).map(async (name) => {
        try {
          const { data: techId } =
            await queries.technologies.getOrCreateId(name);
          if (techId) {
            techNameToId.set(name, techId);
          }
        } catch (error) {
          console.error(
            `Failed to get or create technology "${name}":`,
            getErrorMessage(error)
          );
        }
      })
    );
    return techNameToId;
  }

  private buildLinksFromCache(
    preparedData: PreparedOfferData[],
    insertedOffers: Offer[],
    techNameToId: Map<string, number>
  ): TechnologyLink[] {
    const technologyLinks: TechnologyLink[] = [];
    for (let i = 0; i < preparedData.length; i++) {
      const preparedOffer = preparedData[i];
      const insertedOffer = insertedOffers[i];

      if (!insertedOffer) {
        continue;
      }

      if (!preparedOffer?.technologies) {
        continue;
      }

      for (const tech of preparedOffer.technologies) {
        const techId = techNameToId.get(tech.technology_name);
        if (techId) {
          technologyLinks.push({
            offer_id: insertedOffer.id,
            technology_id: techId,
            skill_level: tech.skill_level,
          });
        }
      }
    }
    return technologyLinks;
  }

  private async buildTechnologyLinks(
    preparedData: PreparedOfferData[],
    insertedOffers: Offer[]
  ): Promise<TechnologyLink[]> {
    const uniqueTechNames = this.collectUniqueTechnologyNames(preparedData);
    const techNameToId = await this.fetchTechnologyIds(uniqueTechNames);
    return this.buildLinksFromCache(preparedData, insertedOffers, techNameToId);
  }

  private async linkTechnologiesToOffers(
    technologyLinks: TechnologyLink[],
    scrapingRunId: number
  ): Promise<void> {
    if (technologyLinks.length === 0) {
      return;
    }

    const { error } =
      await queries.offer_technologies.linkManyToOffer(technologyLinks);

    if (error) {
      await queries.scraping_runs.update(scrapingRunId, {
        status: "failed",
      });
      throw new BadRequestError(
        `Failed to save technologies: ${error.message}`
      );
    }
  }

  private async saveOffers(
    preparedData: PreparedOfferData[],
    scrapingRunId: number
  ): Promise<Offer[]> {
    const offersToInsert = preparedData.map((data) => data.offer);
    const { data: insertedOffers, error } =
      await queries.offers.upsertMany(offersToInsert);

    if (error) {
      await queries.scraping_runs.update(scrapingRunId, {
        status: "failed",
      });
      throw new BadRequestError(`Failed to save offers: ${error.message}`);
    }

    if (!insertedOffers) {
      return [];
    }

    return insertedOffers;
  }

  private async updateScrapingRunSuccess(
    scrapingRunId: number,
    offersCount: number
  ): Promise<void> {
    await queries.scraping_runs.update(scrapingRunId, {
      status: "completed",
      finished_at: new Date().toISOString(),
      offers_found_count: offersCount,
    });
  }

  private async updateScrapingRunFailure(
    scrapingRunId: number,
    errorMessage: string
  ): Promise<void> {
    await queries.scraping_runs.update(scrapingRunId, {
      status: "failed",
      finished_at: new Date().toISOString(),
      error_message: errorMessage,
    });
  }

  async scrapeOffersByTechnology(
    technology: TTechnology
  ): Promise<ScrapeOffersByTechnologyResult> {
    const { data: scrapingRun, error: runError } =
      await queries.scraping_runs.create({
        status: "running",
      });

    if (runError || !scrapingRun) {
      throw new BadRequestError("Failed to create scraping run");
    }

    try {
      const preparedData = await this.strategy.getOffersByTechnology(
        technology,
        scrapingRun.id
      );

      if (preparedData.length === 0) {
        await this.updateScrapingRunSuccess(scrapingRun.id, 0);
        return {
          runId: scrapingRun.id,
          offersCount: 0,
        };
      }

      const insertedOffers = await this.saveOffers(
        preparedData,
        scrapingRun.id
      );

      if (insertedOffers.length > 0) {
        const technologyLinks = await this.buildTechnologyLinks(
          preparedData,
          insertedOffers
        );
        await this.linkTechnologiesToOffers(technologyLinks, scrapingRun.id);
      }

      await this.updateScrapingRunSuccess(scrapingRun.id, preparedData.length);

      return {
        runId: scrapingRun.id,
        offersCount: preparedData.length,
      };
    } catch (error) {
      await this.updateScrapingRunFailure(
        scrapingRun.id,
        getErrorMessage(error)
      );

      throw error;
    }
  }
}

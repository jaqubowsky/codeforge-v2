import { queries } from "@codeforge-v2/database";
import { embeddings } from "@codeforge-v2/embeddings";
import type {
  Offer,
  PreparedOfferData,
  ScrapeOffersByTechnologyResult,
  ScrapingStrategy,
  TechnologyLink,
} from "../types/scraper-types";
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
        } catch (_error) {
          // Skip failed technology lookups
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

  private async generateOfferEmbeddings(
    preparedData: PreparedOfferData[]
  ): Promise<void> {
    await Promise.all(
      preparedData.map(async (data) => {
        try {
          const techNames =
            data.technologies?.map((t) => t.technology_name).join(", ") || "";

          const embeddingText = [
            data.offer.title,
            data.offer.experience_level || "",
            techNames,
            data.offer.city || "",
          ]
            .filter(Boolean)
            .join(" | ");

          const embedding = await embeddings.generateEmbedding(embeddingText);

          (data.offer as Record<string, unknown>).embedding = embedding;
        } catch (_error) {
          // Skip failed embeddings
        }
      })
    );
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

      await this.generateOfferEmbeddings(preparedData);

      const validOffers = preparedData.filter(
        (data) => data.offer.embedding !== undefined
      );

      const insertedOffers = await this.saveOffers(validOffers, scrapingRun.id);

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

  /**
   * Scrapes offers and filters by user skills before saving
   * This is the main entry point for user-triggered scraping
   */
  async scrapeAndFilterBySkills(
    technology: TTechnology,
    userSkills: string[],
    filterFn: (
      data: PreparedOfferData[],
      skills: string[]
    ) => PreparedOfferData[]
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

      // Filter by user skills before generating embeddings
      const filteredData = filterFn(preparedData, userSkills);

      if (filteredData.length === 0) {
        await this.updateScrapingRunSuccess(scrapingRun.id, 0);
        return {
          runId: scrapingRun.id,
          offersCount: 0,
        };
      }

      await this.generateOfferEmbeddings(filteredData);

      const validOffers = filteredData.filter(
        (data) => data.offer.embedding !== undefined
      );

      const insertedOffers = await this.saveOffers(validOffers, scrapingRun.id);

      if (insertedOffers.length > 0) {
        const technologyLinks = await this.buildTechnologyLinks(
          filteredData,
          insertedOffers
        );
        await this.linkTechnologiesToOffers(technologyLinks, scrapingRun.id);
      }

      await this.updateScrapingRunSuccess(scrapingRun.id, filteredData.length);

      return {
        runId: scrapingRun.id,
        offersCount: filteredData.length,
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

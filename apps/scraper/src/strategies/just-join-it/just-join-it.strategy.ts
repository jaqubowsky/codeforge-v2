import type {
  ExperienceLevel,
  LanguageInfo,
  LocationInfo,
  OfferInsert,
  PreparedOfferData,
  ScrapingOptions,
  ScrapingStrategy,
  SkillLevel,
  TechnologyData,
} from "../../types";
import type {
  JustJoinItApiResponse,
  JustJoinItEmploymentType,
  JustJoinItOffer,
  JustJoinItProviderOptions,
  JustJoinItTechnology,
} from "../../types/just-join-it";
import { TECHNOLOGY_TO_CATEGORY_MAP } from "../../types/just-join-it";
import { executeInBatches } from "../../utils/batch-processor";
import { sleep } from "../../utils/sleep";

const API_BASE_URL =
  "https://justjoin.it/api/base/v2/user-panel/offers/by-cursor";

const DEFAULT_OPTIONS: Required<Omit<ScrapingOptions, "providerOptions">> = {
  itemsPerPage: 100,
  maxOffers: 1000,
  maxIterations: 1,
  concurrencyLimit: 5,
};

const RATE_LIMIT_DELAY_MS = 1000;

const DEFAULT_PROVIDER_OPTIONS: Required<JustJoinItProviderOptions> = {
  currency: "pln",
  orderBy: "DESC",
  sortBy: "published",
  cityRadiusKm: 30,
};

export class JustJoinItStrategy
  implements ScrapingStrategy<JustJoinItTechnology>
{
  private readonly options: Required<Omit<ScrapingOptions, "providerOptions">>;
  private readonly providerOptions: Required<JustJoinItProviderOptions>;

  constructor(options?: ScrapingOptions) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    this.providerOptions = {
      ...DEFAULT_PROVIDER_OPTIONS,
      ...(options?.providerOptions as JustJoinItProviderOptions),
    };
  }
  private processOfferForDatabase(
    apiOffer: JustJoinItOffer,
    scrapingRunId: number
  ): PreparedOfferData {
    const offerInsert = this.convertToOfferInsert(apiOffer, scrapingRunId);
    const technologies = this.mapSkillsToTechnologies(
      apiOffer.requiredSkills,
      apiOffer.niceToHaveSkills
    );

    return {
      offer: offerInsert,
      technologies,
    };
  }

  private async fetchOffers(
    cursor: number,
    itemsCount: number,
    technology?: JustJoinItTechnology | undefined
  ): Promise<JustJoinItApiResponse> {
    const params = new URLSearchParams({
      cityRadiusKm: this.providerOptions.cityRadiusKm.toString(),
      currency: this.providerOptions.currency,
      from: cursor.toString(),
      itemsCount: itemsCount.toString(),
      orderBy: this.providerOptions.orderBy,
      sortBy: this.providerOptions.sortBy,
    });

    if (technology) {
      const categoryId = TECHNOLOGY_TO_CATEGORY_MAP[technology];
      params.append("categories[]", categoryId.toString());
    }

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json() as Promise<JustJoinItApiResponse>;
  }

  private getEmptySalary() {
    return {
      from: undefined,
      to: undefined,
      currency: undefined,
      period: undefined,
      type: undefined,
    } as const;
  }

  private normalizeSalary(employmentTypes: JustJoinItEmploymentType[]) {
    const employment = employmentTypes[0];
    if (!employment) {
      return this.getEmptySalary();
    }

    const { from, to, currency, type, unit } = employment;
    const hasNoSalary = from === null && to === null;
    if (hasNoSalary) {
      return this.getEmptySalary();
    }

    return {
      from,
      to,
      currency: currency?.toUpperCase(),
      period: unit,
      type: type === "any" ? undefined : type,
    };
  }

  private normalizeLocation(apiOffer: JustJoinItOffer): LocationInfo {
    return {
      city: apiOffer.city,
      street: apiOffer.street,
    };
  }

  private normalizeLanguages(apiOffer: JustJoinItOffer): LanguageInfo[] {
    return apiOffer.languages.map((lang) => ({
      code: lang.code,
      level: lang.level,
    }));
  }

  private normalizeExperienceLevel(apiOffer: JustJoinItOffer): ExperienceLevel {
    if (apiOffer.experienceLevel === "c_level") {
      return "senior";
    }
    return apiOffer.experienceLevel;
  }

  private createTechnologyData(
    name: string,
    level: SkillLevel
  ): TechnologyData {
    return {
      technology_name: name,
      skill_level: level,
    };
  }

  private mapSkillsToTechnologies(
    requiredSkills: string[],
    niceToHaveSkills: string[] | null
  ): TechnologyData[] {
    const required = requiredSkills.map((skill) =>
      this.createTechnologyData(skill, "required")
    );
    const niceToHave =
      niceToHaveSkills?.map((skill) =>
        this.createTechnologyData(skill, "nice_to_have")
      ) ?? [];

    return [...required, ...niceToHave];
  }

  private convertToOfferInsert(
    apiOffer: JustJoinItOffer,
    scrapingRunId: number
  ): OfferInsert {
    const salary = this.normalizeSalary(apiOffer.employmentTypes);
    const location = this.normalizeLocation(apiOffer);
    const languages = this.normalizeLanguages(apiOffer);
    const experienceLevel = this.normalizeExperienceLevel(apiOffer);

    return {
      title: apiOffer.title,
      company_name: apiOffer.companyName,
      offer_url: `https://justjoin.it/offers/${apiOffer.slug}`,
      slug: apiOffer.slug,
      scraping_run_id: scrapingRunId,
      salary_from: salary.from,
      salary_to: salary.to,
      salary_currency: salary.currency,
      salary_period: salary.period,
      employment_type: salary.type,
      city: location.city,
      street: location.street,
      workplace_type: apiOffer.workplaceType,
      working_time: apiOffer.workingTime,
      experience_level: experienceLevel,
      languages,
      published_at: apiOffer.publishedAt,
      expired_at: apiOffer.expiredAt,
      last_published_at: apiOffer.publishedAt,
      company_logo_thumb_url: apiOffer.companyLogoThumbUrl,
      application_url: undefined,
    };
  }

  private shouldStopFetching(
    apiOffers: JustJoinItOffer[],
    hasMore: boolean
  ): boolean {
    return apiOffers.length >= this.options.maxOffers || !hasMore;
  }

  private hasMoreOffers(
    response: JustJoinItApiResponse,
    cursor: number
  ): boolean {
    return response.meta.next.cursor > cursor && response.data.length > 0;
  }

  private async fetchAllOffers(
    technology?: JustJoinItTechnology | undefined
  ): Promise<JustJoinItOffer[]> {
    const apiOffers: JustJoinItOffer[] = [];
    let cursor = 0;

    for (let i = 0; i < this.options.maxIterations; i++) {
      const response = await this.fetchOffers(
        cursor,
        this.options.itemsPerPage,
        technology
      );
      apiOffers.push(...response.data);

      const hasMore = this.hasMoreOffers(response, cursor);
      cursor = response.meta.next.cursor;

      if (this.shouldStopFetching(apiOffers, hasMore)) {
        break;
      }

      if (i < this.options.maxIterations - 1 && hasMore) {
        await sleep(RATE_LIMIT_DELAY_MS);
      }
    }

    return apiOffers;
  }

  async getOffersByTechnology(
    technology: JustJoinItTechnology | undefined,
    scrapingRunId: number
  ): Promise<PreparedOfferData[]> {
    const apiOffers = await this.fetchAllOffers(technology);

    return executeInBatches(
      apiOffers,
      (apiOffer) => this.processOfferForDatabase(apiOffer, scrapingRunId),
      this.options.concurrencyLimit
    );
  }
}

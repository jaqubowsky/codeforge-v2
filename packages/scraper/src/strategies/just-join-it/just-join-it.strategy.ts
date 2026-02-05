import type { BaseProviderOptions } from "../../schemas/base-schemas";
import type { JustJoinItProviderOptions } from "../../schemas/justjoinit";
import type {
  JustJoinItApiResponse,
  JustJoinItEmploymentType,
  JustJoinItOffer,
  JustJoinItSkill,
  JustJoinItTechnology,
} from "../../types/just-join-it";
import type {
  ExperienceLevel,
  LocationInfo,
  OfferInsert,
  PreparedOfferData,
  SalaryPeriod,
  ScrapingOptions,
  ScrapingStrategy,
  SkillLevel,
  TechnologyData,
} from "../../types/scraper-types";
import { executeInBatches } from "../../utils/batch-processor";
import { sleep } from "../../utils/sleep";

const API_BASE_URL = "https://justjoin.it/api/candidate-api/offers";

const DEFAULT_OPTIONS: Required<Omit<ScrapingOptions, "providerOptions">> = {
  itemsPerPage: 100,
  maxOffers: 500,
  maxIterations: 5,
  concurrencyLimit: 5,
};

const RATE_LIMIT_DELAY_MS = 1000;

const DEFAULT_PROVIDER_OPTIONS: Required<JustJoinItProviderOptions> = {
  currency: "pln",
  orderBy: "descending",
  sortBy: "publishedAt",
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

    const mappedOptions = this.mapProviderOptions(
      options?.providerOptions as BaseProviderOptions | undefined
    );

    this.providerOptions = {
      ...DEFAULT_PROVIDER_OPTIONS,
      ...mappedOptions,
    };
  }

  private mapProviderOptions(
    baseOptions?: BaseProviderOptions
  ): Partial<JustJoinItProviderOptions> {
    if (!baseOptions) {
      return {};
    }

    const prevCurrency = baseOptions.currency;
    const prevSortBy = baseOptions.sortBy;
    const prevOrderBy = baseOptions.orderBy;

    const mapped: Partial<JustJoinItProviderOptions> = {};

    if (prevCurrency) {
      mapped.currency = prevCurrency;
    }

    if (prevSortBy) {
      mapped.sortBy = prevSortBy === "publishedAt" ? "publishedAt" : "salary";
    }

    if (prevOrderBy) {
      mapped.orderBy = prevOrderBy === "DESC" ? "descending" : "ascending";
    }

    if (baseOptions.cityRadiusKm) {
      mapped.cityRadiusKm = baseOptions.cityRadiusKm;
    }

    return mapped;
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
      cityRadius: this.providerOptions.cityRadiusKm.toString(),
      currency: this.providerOptions.currency,
      from: cursor.toString(),
      itemsCount: itemsCount.toString(),
      orderBy: this.providerOptions.orderBy,
      sortBy: this.providerOptions.sortBy,
    });

    if (technology) {
      params.append("categories[]", technology);
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
      period: unit?.toLowerCase() as SalaryPeriod,
      type: type === "any" ? undefined : type,
    };
  }

  private normalizeLocation(apiOffer: JustJoinItOffer): LocationInfo {
    return {
      city: apiOffer.city,
      street: apiOffer.street,
    };
  }

  private normalizeExperienceLevel(apiOffer: JustJoinItOffer): ExperienceLevel {
    if (apiOffer.experienceLevel === "c_level") {
      return "c-level";
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
    requiredSkills: JustJoinItSkill[],
    niceToHaveSkills: JustJoinItSkill[] | null
  ): TechnologyData[] {
    const required = requiredSkills.map((skill) =>
      this.createTechnologyData(skill.name, "required")
    );
    const niceToHave =
      niceToHaveSkills?.map((skill) =>
        this.createTechnologyData(skill.name, "nice_to_have")
      ) ?? [];

    return [...required, ...niceToHave];
  }

  private convertToOfferInsert(
    apiOffer: JustJoinItOffer,
    scrapingRunId: number
  ): OfferInsert {
    const salary = this.normalizeSalary(apiOffer.employmentTypes);
    const location = this.normalizeLocation(apiOffer);
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
      published_at: apiOffer.publishedAt,
      expires_at: apiOffer.expiredAt,
      last_published_at: apiOffer.publishedAt,
      company_logo_thumb_url: apiOffer.companyLogoThumbUrl,
      application_url: `https://justjoin.it/offers/${apiOffer.slug}`,
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

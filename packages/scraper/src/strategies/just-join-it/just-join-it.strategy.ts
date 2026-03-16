import type { Database } from "@codeforge-v2/database";
import { baseProviderOptionsSchema } from "../../schemas/base-schemas";
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

type WorkingTime = Database["public"]["Enums"]["working_time_enum"] | null;
type WorkplaceType = Database["public"]["Enums"]["workplace_type_enum"] | null;
type EmploymentType =
  | Database["public"]["Enums"]["employment_type_enum"]
  | null;

const VALID_WORKING_TIMES = new Set<string>([
  "full_time",
  "part_time",
  "b2b",
  "internship",
  "freelance",
]);

const VALID_WORKPLACE_TYPES = new Set<string>(["remote", "hybrid", "office"]);

const VALID_EMPLOYMENT_TYPES = new Set<string>([
  "permanent",
  "b2b",
  "internship",
  "mandate_contract",
]);

const EXPERIENCE_LEVEL_MAP: Record<string, ExperienceLevel> = {
  junior: "junior",
  mid: "mid",
  senior: "senior",
  c_level: "c-level",
};

import { executeInBatches } from "../../utils/batch-processor";
import { sleep } from "../../utils/sleep";

const API_BASE_URL = "https://justjoin.it/api/candidate-api/offers";

const DEFAULT_OPTIONS: Required<Omit<ScrapingOptions, "providerOptions">> = {
  itemsPerPage: 100,
  maxOffers: 500,
  maxIterations: 5,
  concurrencyLimit: 5,
};

const RATE_LIMIT_DELAY_MS = 1500;

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

    const baseOptions = options?.providerOptions
      ? baseProviderOptionsSchema.parse(options.providerOptions)
      : undefined;

    this.providerOptions = {
      ...DEFAULT_PROVIDER_OPTIONS,
      ...this.mapProviderOptions(baseOptions),
    };
  }

  private mapProviderOptions(
    baseOptions?: ReturnType<typeof baseProviderOptionsSchema.parse>
  ): Partial<JustJoinItProviderOptions> {
    if (!baseOptions) {
      return {};
    }

    const mapped: Partial<JustJoinItProviderOptions> = {};

    if (baseOptions.currency) {
      mapped.currency = baseOptions.currency;
    }

    if (baseOptions.sortBy) {
      mapped.sortBy =
        baseOptions.sortBy === "publishedAt" ? "publishedAt" : "salary";
    }

    if (baseOptions.orderBy) {
      mapped.orderBy =
        baseOptions.orderBy === "DESC" ? "descending" : "ascending";
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
    categories: JustJoinItTechnology[]
  ): Promise<JustJoinItApiResponse> {
    const params = new URLSearchParams({
      cityRadius: this.providerOptions.cityRadiusKm.toString(),
      currency: this.providerOptions.currency,
      from: cursor.toString(),
      itemsCount: itemsCount.toString(),
      orderBy: this.providerOptions.orderBy,
      sortBy: this.providerOptions.sortBy,
    });

    for (const category of categories) {
      params.append("categories", category);
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

    const { from, to, currency, type } = employment;
    const hasNoSalary = from === null && to === null;
    if (hasNoSalary) {
      return this.getEmptySalary();
    }

    const period: SalaryPeriod = "month";

    return {
      from,
      to,
      currency: currency?.toUpperCase(),
      period,
      type: this.normalizeEmploymentType(type),
    };
  }

  private normalizeLocation(apiOffer: JustJoinItOffer): LocationInfo {
    return {
      city: apiOffer.city,
      street: apiOffer.street,
    };
  }

  private normalizeWorkingTime(workingTime: string): WorkingTime {
    if (VALID_WORKING_TIMES.has(workingTime)) {
      return workingTime as Database["public"]["Enums"]["working_time_enum"];
    }
    return null;
  }

  private normalizeWorkplaceType(workplaceType: string): WorkplaceType {
    if (VALID_WORKPLACE_TYPES.has(workplaceType)) {
      return workplaceType as Database["public"]["Enums"]["workplace_type_enum"];
    }
    return null;
  }

  private normalizeEmploymentType(type: string): EmploymentType {
    if (VALID_EMPLOYMENT_TYPES.has(type)) {
      return type as Database["public"]["Enums"]["employment_type_enum"];
    }
    return null;
  }

  private normalizeExperienceLevel(experienceLevel: string): ExperienceLevel {
    return EXPERIENCE_LEVEL_MAP[experienceLevel] ?? null;
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
    const experienceLevel = this.normalizeExperienceLevel(
      apiOffer.experienceLevel
    );

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
      workplace_type: this.normalizeWorkplaceType(apiOffer.workplaceType),
      working_time: this.normalizeWorkingTime(apiOffer.workingTime),
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
    categories: JustJoinItTechnology[]
  ): Promise<JustJoinItOffer[]> {
    const apiOffers: JustJoinItOffer[] = [];
    let cursor = 0;

    for (let i = 0; i < this.options.maxIterations; i++) {
      const response = await this.fetchOffers(
        cursor,
        this.options.itemsPerPage,
        categories
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

  async getOffers(
    categories: JustJoinItTechnology[],
    scrapingRunId: number
  ): Promise<PreparedOfferData[]> {
    const apiOffers = await this.fetchAllOffers(categories);

    return executeInBatches(
      apiOffers,
      (apiOffer) => this.processOfferForDatabase(apiOffer, scrapingRunId),
      this.options.concurrencyLimit
    );
  }
}

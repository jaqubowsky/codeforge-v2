import { baseProviderOptionsSchema } from "../../schemas/base-schemas";
import type { NoFluffJobsProviderOptions } from "../../schemas/nofluffjobs";
import type {
  NoFluffJobsCategory,
  NoFluffJobsPosting,
  NoFluffJobsSalary,
  NoFluffJobsSearchResponse,
  NoFluffJobsTiles,
} from "../../types/no-fluff-jobs";
import type {
  EmploymentType,
  ExperienceLevel,
  LocationInfo,
  OfferInsert,
  PreparedOfferData,
  SalaryPeriod,
  ScrapingOptions,
  ScrapingStrategy,
  TechnologyData,
  WorkplaceType,
} from "../../types/scraper-types";
import { executeInBatches } from "../../utils/batch-processor";
import { sleep } from "../../utils/sleep";

const API_BASE_URL = "https://nofluffjobs.com/api/search/posting";
const LOGO_BASE_URL = "https://static.nofluffjobs.com/";

const DEFAULT_OPTIONS: Required<Omit<ScrapingOptions, "providerOptions">> = {
  itemsPerPage: 120,
  maxOffers: 500,
  maxIterations: 5,
  concurrencyLimit: 5,
};

const RATE_LIMIT_DELAY_MS = 1500;

const DEFAULT_PROVIDER_OPTIONS: Required<NoFluffJobsProviderOptions> = {
  salaryCurrency: "PLN",
  salaryPeriod: "month",
  region: "pl",
};

const SENIORITY_PRIORITY: Record<string, ExperienceLevel> = {
  Expert: "senior",
  Senior: "senior",
  Mid: "mid",
  Junior: "junior",
  Trainee: "junior",
};

const LEVEL_ORDER: NonNullable<ExperienceLevel>[] = ["junior", "mid", "senior"];

const EMPLOYMENT_MAP: Record<string, EmploymentType> = {
  b2b: "b2b",
  permanent: "permanent",
  zlecenie: "mandate_contract",
  uod: "mandate_contract",
  intern: "internship",
};

const CURRENCY_MAP: Record<
  "pln" | "usd" | "eur",
  NonNullable<NoFluffJobsProviderOptions["salaryCurrency"]>
> = {
  pln: "PLN",
  usd: "USD",
  eur: "EUR",
};

export class NoFluffJobsStrategy
  implements ScrapingStrategy<NoFluffJobsCategory>
{
  private readonly options: Required<Omit<ScrapingOptions, "providerOptions">>;
  private readonly providerOptions: Required<NoFluffJobsProviderOptions>;

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
  ): Partial<NoFluffJobsProviderOptions> {
    if (!baseOptions) {
      return {};
    }

    const mapped: Partial<NoFluffJobsProviderOptions> = {};

    if (baseOptions.currency) {
      mapped.salaryCurrency = CURRENCY_MAP[baseOptions.currency];
    }

    return mapped;
  }

  private processOfferForDatabase(
    apiOffer: NoFluffJobsPosting,
    scrapingRunId: number
  ): PreparedOfferData {
    const offerInsert = this.convertToOfferInsert(apiOffer, scrapingRunId);
    const technologies = this.mapTilesToTechnologies(apiOffer.tiles);

    return {
      offer: offerInsert,
      technologies,
    };
  }

  private async fetchOffers(
    page: number,
    categories: NoFluffJobsCategory[]
  ): Promise<NoFluffJobsSearchResponse> {
    const params = new URLSearchParams({
      salaryCurrency: this.providerOptions.salaryCurrency,
      salaryPeriod: this.providerOptions.salaryPeriod,
      region: this.providerOptions.region,
    });

    const body = {
      rawSearch: "",
      page,
      criteriaSearch: {
        category: categories,
        requirement: [],
        city: [],
        country: [],
        employment: [],
      },
    };

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `NoFluffJobs API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json() as Promise<NoFluffJobsSearchResponse>;
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

  private normalizeWorkplaceType(posting: NoFluffJobsPosting): WorkplaceType {
    const cities = posting.location.places
      .map((p) => p.city)
      .filter((c): c is string => c !== undefined && c !== null);

    const hasRemote = cities.includes("Remote");
    const hasPhysical = cities.some((c) => c !== "Remote");
    const hasHybridDesc = (posting.location.hybridDesc?.length ?? 0) > 0;

    if (hasRemote && !hasPhysical) {
      return "remote";
    }

    if (hasRemote && hasPhysical) {
      return "hybrid";
    }

    if (hasHybridDesc) {
      return "hybrid";
    }

    return "office";
  }

  private normalizeExperienceLevel(seniority: string[]): ExperienceLevel {
    let highest: NonNullable<ExperienceLevel> = "junior";

    for (const s of seniority) {
      const mapped = SENIORITY_PRIORITY[s];
      if (
        mapped &&
        LEVEL_ORDER.indexOf(mapped) > LEVEL_ORDER.indexOf(highest)
      ) {
        highest = mapped;
      }
    }

    return highest;
  }

  private normalizeEmploymentType(type: string): EmploymentType | undefined {
    return EMPLOYMENT_MAP[type];
  }

  private normalizeSalary(salary: NoFluffJobsSalary | null) {
    if (!salary?.from) {
      return this.getEmptySalary();
    }

    const period: SalaryPeriod = "month";

    return {
      from: salary.from,
      to: salary.to,
      currency: salary.currency?.toUpperCase(),
      period,
      type: this.normalizeEmploymentType(salary.type),
    };
  }

  private normalizeLocation(posting: NoFluffJobsPosting): LocationInfo {
    const physicalPlace = posting.location.places.find(
      (p) => p.city && p.city !== "Remote" && !p.provinceOnly
    );

    return {
      city: physicalPlace?.city ?? null,
      street: physicalPlace?.street ?? null,
    };
  }

  private mapTilesToTechnologies(tiles: NoFluffJobsTiles): TechnologyData[] {
    return tiles.values
      .filter((tile) => tile.type === "requirement")
      .map(
        (tile): TechnologyData => ({
          technology_name: tile.value,
          skill_level: "required",
        })
      );
  }

  private safeTimestampToISO(timestamp: number): string | undefined {
    if (!Number.isFinite(timestamp) || timestamp === 0) {
      return undefined;
    }
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return undefined;
    }
    return date.toISOString();
  }

  private convertToOfferInsert(
    apiOffer: NoFluffJobsPosting,
    scrapingRunId: number
  ): OfferInsert {
    const salary = this.normalizeSalary(apiOffer.salary);
    const location = this.normalizeLocation(apiOffer);
    const experienceLevel = this.normalizeExperienceLevel(apiOffer.seniority);
    const workplaceType = this.normalizeWorkplaceType(apiOffer);

    const logoUrl = apiOffer.logo?.jobs_listing
      ? `${LOGO_BASE_URL}${apiOffer.logo.jobs_listing}`
      : undefined;

    return {
      title: apiOffer.title,
      company_name: apiOffer.name,
      offer_url: `https://nofluffjobs.com/pl/job/${apiOffer.url}`,
      slug: apiOffer.url,
      scraping_run_id: scrapingRunId,
      salary_from: salary.from,
      salary_to: salary.to,
      salary_currency: salary.currency,
      salary_period: salary.period,
      employment_type: salary.type,
      city: location.city,
      street: location.street,
      workplace_type: workplaceType,
      working_time: "full_time",
      experience_level: experienceLevel,
      published_at: this.safeTimestampToISO(apiOffer.posted),
      expires_at: undefined,
      last_published_at: this.safeTimestampToISO(apiOffer.renewed),
      company_logo_thumb_url: logoUrl,
      application_url: `https://nofluffjobs.com/pl/job/${apiOffer.url}`,
    };
  }

  private shouldStopFetching(
    apiOffers: NoFluffJobsPosting[],
    totalPages: number,
    currentPage: number
  ): boolean {
    return (
      apiOffers.length >= this.options.maxOffers || currentPage >= totalPages
    );
  }

  private async fetchAllOffers(
    categories: NoFluffJobsCategory[]
  ): Promise<NoFluffJobsPosting[]> {
    const apiOffers: NoFluffJobsPosting[] = [];
    let currentPage = 1;

    for (let i = 0; i < this.options.maxIterations; i++) {
      const response = await this.fetchOffers(currentPage, categories);
      apiOffers.push(...response.postings);

      if (
        this.shouldStopFetching(apiOffers, response.totalPages, currentPage)
      ) {
        break;
      }

      currentPage++;

      if (i < this.options.maxIterations - 1) {
        await sleep(RATE_LIMIT_DELAY_MS);
      }
    }

    return this.deduplicatePostings(apiOffers);
  }

  private deduplicatePostings(
    postings: NoFluffJobsPosting[]
  ): NoFluffJobsPosting[] {
    const seen = new Map<string, NoFluffJobsPosting>();
    for (const posting of postings) {
      const key = `${posting.title}::${posting.name}`;
      if (!seen.has(key)) {
        seen.set(key, posting);
      }
    }
    return Array.from(seen.values());
  }

  async getOffers(
    categories: NoFluffJobsCategory[],
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

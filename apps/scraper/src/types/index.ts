import type { Database } from "@codeforge-v2/database";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export type EmploymentType = Enums<"employment_type_enum"> | null;
export type ExperienceLevel = Enums<"experience_level_enum"> | null;
export type WorkingTime = Enums<"working_time_enum"> | null;
export type WorkplaceType = Enums<"workplace_type_enum"> | null;
export type SalaryPeriod = Enums<"salary_period_enum"> | null;
export type SkillLevel = Enums<"skill_level_enum">;
export type RunStatus = Enums<"run_status_enum"> | null;

export type Offer = Tables<"offers">;
export type OfferInsert = TablesInsert<"offers">;
export type OfferUpdate = TablesUpdate<"offers">;
export type Technology = Tables<"technologies">;
export type TechnologyInsert = TablesInsert<"technologies">;
export type OfferTechnology = Tables<"offer_technologies">;
export type OfferTechnologyInsert = TablesInsert<"offer_technologies">;
export type ScrapingRun = Tables<"scraping_runs">;
export type ScrapingRunInsert = TablesInsert<"scraping_runs">;
export type ScrapingRunUpdate = TablesUpdate<"scraping_runs">;

export type Skill = {
  name: Technology["name"];
  level: SkillLevel;
};

export type LanguageInfo = {
  code: string;
  level: string;
};

export type LocationInfo = {
  city: Offer["city"];
  street: Offer["street"];
};

export type TechnologyData = {
  technology_name: string;
  skill_level: SkillLevel;
};

export type TechnologyLink = {
  offer_id: number;
  technology_id: number;
  skill_level: SkillLevel;
};

export type PreparedOfferData = {
  offer: OfferInsert;
  technologies: TechnologyData[];
};

export type ScrapeOffersByTechnologyResult = {
  runId: number;
  offersCount: number;
};

export type ScrapingOptions = {
  itemsPerPage?: number;
  maxOffers?: number;
  maxIterations?: number;
  concurrencyLimit?: number;

  providerOptions?: Record<string, unknown>;
};

export type ScrapingStrategy<TTechnology = string | undefined> = {
  getOffersByTechnology(
    technology: TTechnology | undefined,
    scrapingRunId: number
  ): Promise<PreparedOfferData[]>;
};

export const AVAILABLE_JOB_BOARDS = ["justjoinit"] as const;
export type JobBoard = (typeof AVAILABLE_JOB_BOARDS)[number];

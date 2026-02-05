import type { Database } from "@codeforge-v2/database";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export type ExperienceLevel = Enums<"experience_level_enum"> | null;
export type SalaryPeriod = Enums<"salary_period_enum"> | null;
export type SkillLevel = Enums<"skill_level_enum">;

export type Offer = Tables<"offers">;
export type OfferInsert = TablesInsert<"offers">;

export interface LocationInfo {
  city: Offer["city"];
  street: Offer["street"];
}

export interface TechnologyData {
  technology_name: string;
  skill_level: SkillLevel;
}

export interface TechnologyLink {
  offer_id: number;
  technology_id: number;
  skill_level: SkillLevel;
}

export interface PreparedOfferData {
  offer: OfferInsert;
  technologies: TechnologyData[];
}

export interface ScrapeOffersByTechnologyResult {
  runId: number;
  offersCount: number;
}

export interface ScrapingOptions {
  itemsPerPage?: number;
  maxOffers?: number;
  maxIterations?: number;
  concurrencyLimit?: number;

  providerOptions?: Record<string, unknown>;
}

export interface ScrapingStrategy<TTechnology = string | undefined> {
  getOffersByTechnology(
    technology: TTechnology | undefined,
    scrapingRunId: number
  ): Promise<PreparedOfferData[]>;
}

export const AVAILABLE_JOB_BOARDS = ["justjoinit"] as const;
export type JobBoard = (typeof AVAILABLE_JOB_BOARDS)[number];

export interface ScrapeOffersOptions {
  board?: JobBoard;
  maxOffers?: number;
}

export interface ScrapeOffersResult {
  success: boolean;
  runId?: number;
  offersCount?: number;
  error?: string;
}

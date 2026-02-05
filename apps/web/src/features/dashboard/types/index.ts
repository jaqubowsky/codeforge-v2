export type UserOfferStatus =
  | "saved"
  | "applied"
  | "interviewing"
  | "rejected"
  | "offer_received"
  | "deleted";

export interface Technology {
  name: string;
  skillLevel: string;
}

export interface JobOffer {
  id: number;
  title: string;
  companyName: string | null;
  companyLogoUrl: string | null;
  workplaceType: string | null;
  experienceLevel: string | null;
  city: string | null;
  salaryFrom: number | null;
  salaryTo: number | null;
  salaryCurrency: string | null;
  salaryPeriod: string | null;
  technologies: Technology[];
  applicationUrl: string | null;
  offerUrl: string;
  publishedAt: string | null;
}

export interface UserJobOffer extends JobOffer {
  similarityScore: number | null;
  status: UserOfferStatus;
  matchedAt: string;
}

export interface MatchRunInfo {
  lastRunAt: string | null;
  jobsFound: number;
  newJobsCount: number;
  status: "running" | "completed" | "failed" | null;
}

export interface SalaryFiltersMetadata {
  currencies: Currency[];
  maxSalary: number;
}

export interface DashboardData {
  jobs: UserJobOffer[];
  totalCount: number;
  lastRun: MatchRunInfo;
  salaryMetadata: SalaryFiltersMetadata;
}

export type SortOption =
  | "match_desc"
  | "match_asc"
  | "date_desc"
  | "date_asc"
  | "salary_desc"
  | "salary_asc";

export type Currency = "PLN" | "EUR" | "USD" | "GBP";

export interface MatchJobsData {
  newMatchesCount: number;
}

export interface ScrapeAndMatchData {
  newJobsCount: number;
  scrapedCount?: number;
}

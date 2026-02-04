export type UserOfferStatus =
  | "saved"
  | "applied"
  | "interviewing"
  | "rejected"
  | "offer_received";

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

export interface MatchJobsResult {
  success: boolean;
  newMatchesCount?: number;
  error: string | null;
}

export interface GetUserJobsResult {
  success: boolean;
  data?: UserJobOffer[];
  error: string | null;
}

export interface UpdateJobStatusResult {
  success: boolean;
  error: string | null;
}

export interface MatchRunInfo {
  lastRunAt: string | null;
  jobsFound: number;
  newJobsCount: number;
  status: "running" | "completed" | "failed" | null;
}

export interface DashboardData {
  jobs: UserJobOffer[];
  totalCount: number;
  lastRun: MatchRunInfo;
}

export interface FilterState {
  search: string;
  status: UserOfferStatus | "all";
}

interface NoFluffJobsCountry {
  code: string;
  name: string;
}

interface NoFluffJobsPlace {
  country?: NoFluffJobsCountry;
  city?: string;
  street?: string;
  postalCode?: string;
  province?: string;
  url: string;
  provinceOnly?: boolean;
}

export interface NoFluffJobsLocation {
  places: NoFluffJobsPlace[];
  fullyRemote: boolean;
  covidTimeRemotely: boolean;
  hybridDesc: string;
}

export interface NoFluffJobsSalary {
  from: number;
  to: number;
  type: string;
  currency: string;
  disclosedAt: string;
  flexibleUpperBound: boolean;
}

export interface NoFluffJobsLogo {
  jobs_listing?: string;
  jobs_listing_webp?: string;
  [key: string]: string | undefined;
}

export interface NoFluffJobsTileValue {
  value: string;
  type: "category" | "requirement" | "jobLanguage";
}

export interface NoFluffJobsTiles {
  values: NoFluffJobsTileValue[];
}

export interface NoFluffJobsPosting {
  id: string;
  name: string;
  title: string;
  url: string;
  category: string;
  technology?: string;
  seniority: string[];
  fullyRemote: boolean;
  posted: number;
  renewed: number;
  regions: string[];
  salary: NoFluffJobsSalary | null;
  location: NoFluffJobsLocation;
  logo: NoFluffJobsLogo;
  tiles: NoFluffJobsTiles;
  flavors?: string[];
  topInSearch?: boolean;
  highlighted?: boolean;
  help4Ua?: boolean;
  reference?: string;
  searchBoost?: boolean;
  onlineInterviewAvailable?: boolean;
}

export interface NoFluffJobsListingResponse {
  postings: NoFluffJobsPosting[];
  totalCount: number;
  totalUniqueCount: number;
  pageUniqueCount: number;
}

export type NoFluffJobsCategory =
  | "frontend"
  | "backend"
  | "fullstack"
  | "mobile"
  | "embedded"
  | "testing"
  | "devops"
  | "architecture"
  | "security"
  | "data"
  | "ai-ml"
  | "game-dev"
  | "ux";

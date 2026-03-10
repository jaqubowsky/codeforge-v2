export interface JustJoinItSkill {
  name: string;
  level: number;
}

export interface JustJoinItOffer {
  guid: string;
  slug: string;
  title: string;
  requiredSkills: JustJoinItSkill[];
  niceToHaveSkills: JustJoinItSkill[] | null;
  workplaceType: "remote" | "hybrid" | "office";
  workingTime: string;
  experienceLevel: "junior" | "mid" | "senior" | "c_level";
  employmentTypes: JustJoinItEmploymentType[];
  categoryId: number;
  multilocation: JustJoinItLocation[];
  city: string;
  street: string;
  latitude: string;
  longitude: string;
  remoteInterview: boolean;
  companyName: string;
  companyLogoThumbUrl: string;
  publishedAt: string;
  lastPublishedAt: string;
  expiredAt: string;
  openToHireUkrainians: boolean;
  languages: JustJoinItLanguage[];
  applyMethod: string;
  isSuperOffer: boolean;
  promotedPosition: string | null;
  promotedKeyFilters: string[];
}

export interface JustJoinItEmploymentType {
  from: number | null;
  to: number | null;
  currency: string;
  type: "permanent" | "b2b" | "mandate_contract" | "any";
  unit: "month" | "hour" | "year" | "day";
  gross: boolean;
  fromChf: number | null;
  fromEur: number | null;
  fromGbp: number | null;
  fromPln: number | null;
  fromUsd: number | null;
  toChf: number | null;
  toEur: number | null;
  toGbp: number | null;
  toPln: number | null;
  toUsd: number | null;
}

export interface JustJoinItLocation {
  city: string;
  slug: string;
  street: string;
  latitude: number;
  longitude: number;
}

export interface JustJoinItLanguage {
  code: string;
  level: string;
}

export interface JustJoinItApiResponse {
  data: JustJoinItOffer[];
  meta: {
    from: number;
    prev: {
      cursor: number;
      itemsCount: number;
    };
    next: {
      cursor: number;
      itemsCount: number;
    };
    totalItems: number;
  };
}

export const JUST_JOIN_IT_TECHNOLOGIES = [
  "ai",
  "javascript",
  "html",
  "php",
  "ruby",
  "python",
  "java",
  "net",
  "scala",
  "c",
  "mobile",
  "testing",
  "devops",
  "admin",
  "ux",
  "pm",
  "game",
  "analytics",
  "security",
  "data",
  "go",
  "support",
  "erp",
  "architecture",
  "other",
] as const;

export type JustJoinItTechnology = (typeof JUST_JOIN_IT_TECHNOLOGIES)[number];

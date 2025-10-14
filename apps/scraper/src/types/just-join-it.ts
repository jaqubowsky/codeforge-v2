export type JustJoinItOffer = {
  guid: string;
  slug: string;
  title: string;
  requiredSkills: string[];
  niceToHaveSkills: string[] | null;
  workplaceType: "remote" | "hybrid" | "office";
  workingTime: "full_time" | "part_time" | "b2b" | "freelance";
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
};

export type JustJoinItEmploymentType = {
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
};

export type JustJoinItLocation = {
  city: string;
  slug: string;
  street: string;
  latitude: number;
  longitude: number;
};

export type JustJoinItLanguage = {
  code: string;
  level: string;
};

export type JustJoinItApiResponse = {
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
};

export const JUST_JOIN_IT_TECHNOLOGIES = [
  "ai/ml",
  "js",
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
  "ux/ui",
  "pm",
  "game",
  "analytics",
  "security",
  "data",
  "go",
  "support",
  "ekp",
  "architecture",
  "other",
] as const;

export type JustJoinItTechnology = (typeof JUST_JOIN_IT_TECHNOLOGIES)[number];

export const TECHNOLOGY_TO_CATEGORY_MAP: Record<JustJoinItTechnology, number> =
  {
    "ai/ml": 25,
    js: 1,
    html: 2,
    php: 3,
    ruby: 4,
    python: 5,
    java: 6,
    net: 7,
    scala: 8,
    c: 9,
    mobile: 10,
    testing: 11,
    devops: 12,
    admin: 13,
    "ux/ui": 14,
    pm: 15,
    game: 16,
    analytics: 17,
    security: 18,
    data: 19,
    go: 20,
    support: 21,
    ekp: 22,
    architecture: 23,
    other: 24,
  } as const;

export type JustJoinItProviderOptions = {
  currency?: "pln" | "usd" | "eur";
  orderBy?: "ASC" | "DESC";
  sortBy?: "published" | "salary";
  cityRadiusKm?: number;
};

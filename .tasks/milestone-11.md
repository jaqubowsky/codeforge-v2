# Milestone 11: NoFluffJobs Scraping Strategy

## Overview

Add NoFluffJobs as the second job board scraping source, expanding job coverage for the Polish IT market. NoFluffJobs is the #2 Polish IT job board and has an internal JSON API that returns job listings with salary ranges, tech stacks, experience levels, and workplace types.

**Architecture: Strategy Pattern Extension**
1. Create `NoFluffJobsStrategy` implementing `ScrapingStrategy<string>` (same interface as JustJoinIt)
2. Use the POST search endpoint with user skill keywords as filters
3. The existing `ScrapingService` handles persistence (embeddings, DB upsert, tech linking) — no changes needed
4. Consumer (`scrape-and-match.ts`) calls `scrapeOffers()` sequentially for both boards

## Scope

### In Scope (7 sub-tasks)
- **11.1**: Create NoFluffJobs type definitions (`types/no-fluff-jobs.ts`)
- **11.2**: Create NoFluffJobs Zod validation schema (`schemas/nofluffjobs.ts`)
- **11.3**: Implement NoFluffJobs scraping strategy (`strategies/no-fluff-jobs/no-fluff-jobs.strategy.ts`)
- **11.4**: Register strategy in factory (`strategy-factory.ts`)
- **11.5**: Add `"nofluffjobs"` to `AVAILABLE_JOB_BOARDS` (`scraper-types.ts`)
- **11.6**: Update consumer for sequential dual-board scraping (`scrape-and-match.ts`)
- **11.7**: Update scraper index exports if needed (`index.ts`)

### Out of Scope
- Deduplication by company+title (rely on existing URL-based dedup via `offer_url` unique constraint)
- Detail endpoint integration (listing endpoint provides sufficient data)
- NoFluffJobs-specific skill category map (NoFluffJobs uses free-form skill keywords, not fixed categories)

## Key Decisions (Already Approved)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API endpoint | POST `/api/search/posting` | Supports skill-based filtering and pagination |
| Technology filtering | Map to broad categories, fallback to direct skills | Broad categories like "frontend" first, then user skills like "React" |
| Multi-board scraping | Sequential (scrapeOffers twice) | Simple, clear, no scraper package changes needed |
| Deduplication | URL-based (existing) | Different boards = different URLs, handled by DB constraint |
| Workplace type | Derive from location.places + hybridDesc | No reliable `fullyRemote` flag in listing data |

---

## API Discovery Documentation

### Endpoint: POST `/api/search/posting`

**URL**: `https://nofluffjobs.com/api/search/posting`

**Required Query Parameters**:
- `salaryCurrency` (required): `PLN`, `USD`, `EUR`
- `salaryPeriod`: `month`, `hour`
- `region`: `pl`

**Request Body** (JSON):
```json
{
  "rawSearch": "",
  "page": 1,
  "criteriaSearch": {
    "requirement": ["JavaScript", "React"],
    "city": [],
    "country": [],
    "employment": []
  }
}
```

**Response Shape**:
```json
{
  "postings": [...],
  "totalCount": 4976,
  "totalPages": 28,
  "exactMatchesPages": 28,
  "rawSearch": "",
  "locationCriteria": false,
  "divs": 2873,
  "additionalSearch": [],
  "criteriaSearch": { ... },
  "salaryMatchBlock": { "offers": [], "totalCount": 0, "divs": 0 },
  "overridenSalaryFilter": {}
}
```

**Pagination**: Page-based (1-indexed). ~120 postings per page. `totalPages` indicates total.

### Single Posting Shape (from listing response)

```typescript
{
  id: "lead-javascript-engineer-winged-it-Warszawa",
  name: "Winged IT",                    // company name
  title: "Lead JavaScript Engineer",
  url: "lead-javascript-engineer-winged-it-warszawa",
  category: "fullstack",                // 36 possible values (see below)
  technology: "JavaScript",             // primary technology label
  seniority: ["Senior"],                // array: Junior, Mid, Senior, Expert, Trainee
  fullyRemote: false,                   // NOT reliable - use location.places instead
  posted: 1770034402509,                // Unix timestamp in milliseconds
  renewed: 1770380002509,               // Unix timestamp in milliseconds
  regions: ["pl"],
  salary: {
    from: 36960.0,
    to: 42840.0,
    type: "b2b",                        // b2b, permanent, zlecenie, intern, uod
    currency: "PLN",
    disclosedAt: "VISIBLE",
    flexibleUpperBound: false
  },
  location: {
    places: [
      {
        country: { code: "POL", name: "Poland" },
        city: "Warszawa",
        street: "",
        postalCode: "",
        url: "lead-javascript-engineer-winged-it-warszawa"
      }
    ],
    fullyRemote: false,
    covidTimeRemotely: false,
    hybridDesc: ""                      // Non-empty = hybrid (e.g., "Hybryda: 1-2 x w tygodniu z biura")
  },
  logo: {
    jobs_listing: "companies/logos/jobs_listing/filename.png",
    // ... many other variants (ignored)
  },
  tiles: {
    values: [
      { value: "fullstack", type: "category" },
      { value: "JavaScript", type: "requirement" },
      { value: "Kafka", type: "requirement" },
      { value: "Node.js", type: "requirement" }
    ]
  },
  flavors: ["it"],
  topInSearch: false,
  highlighted: false,
  help4Ua: false,
  searchBoost: false,
  onlineInterviewAvailable: true,
  reference: "TFZY3VKE"                // optional
}
```

### All 36 NoFluffJobs Categories

```
backend, frontend, fullstack, devops, mobile, testing, data, security, ux, agile,
architecture, artificialIntelligence, automation, businessAnalyst, businessIntelligence,
consulting, customerService, electricalEng, electronics, embedded, erp, finance,
gameDev, hr, law, logistics, marketing, mechanics, officeAdministration, other,
productManagement, projectManager, sales, support, sysAdministrator, telecommunication
```

### Workplace Type Determination

The `fullyRemote` boolean in listing data is **NOT reliable** (shows 0 for all 19k+ postings). Instead, derive from location data:

| Condition | Workplace Type |
|-----------|---------------|
| `places` has city === "Remote" AND no other physical cities | `remote` |
| `places` has city === "Remote" AND also has physical cities | `hybrid` |
| `hybridDesc` is non-empty (regardless of places) | `hybrid` |
| None of the above | `office` |

**Distribution in current data**: remote_only: 7529, remote_plus_office (hybrid): 9569, office_hybrid: 229, office_only: 2337

### Seniority → Experience Level Mapping

| NoFluffJobs | Database Enum | Notes |
|-------------|--------------|-------|
| `Junior` | `junior` | Direct mapping |
| `Mid` | `mid` | Direct mapping |
| `Senior` | `senior` | Direct mapping |
| `Expert` | `senior` | Map to senior (no expert in DB) |
| `Trainee` | `junior` | Map to junior |

When multiple seniority values (e.g., `["Mid", "Senior"]`), pick the **highest** level:
Priority: Expert/Senior > Mid > Junior/Trainee

### Employment Type Mapping

| NoFluffJobs | Database Enum | Notes |
|-------------|--------------|-------|
| `b2b` | `b2b` | Direct mapping |
| `permanent` | `permanent` | Direct mapping |
| `zlecenie` | `mandate_contract` | Polish contract type |
| `uod` | `mandate_contract` | Polish contract type |
| `intern` | `permanent` | No intern enum in DB |

### Logo URL Construction

Base URL: `https://nofluffjobs.com/`
Relative path from API: `companies/logos/jobs_listing/filename.png`
Full URL: `https://nofluffjobs.com/companies/logos/jobs_listing/filename.png`

### Salary

The search endpoint normalizes all salaries to the requested `salaryPeriod` (via query param). We default to `month` for consistency with the database schema.

- Salary `from`/`to` are always present when `disclosedAt === "VISIBLE"`
- Currency comes from the query param filter, not individual postings
- `salary.type` indicates employment type (b2b, permanent, etc.)
- Period is always "month" when we request `salaryPeriod=month`

---

## Architecture Design

### Data Flow

```
Consumer calls scrapeOffers({ board: "nofluffjobs", maxOffers: 500, categories: ["React", "TypeScript"] })
  ↓
scrape-for-user.ts → strategy-factory.ts → NoFluffJobsStrategy
  ↓
ScrapingService.scrapeOffers() calls strategy.getOffers(["React", "TypeScript"], scrapingRunId)
  ↓
NoFluffJobsStrategy.fetchAllOffers() loops pages:
  - POST to /api/search/posting?salaryCurrency=PLN&salaryPeriod=month&region=pl
  - Body: { rawSearch: "", page: N, criteriaSearch: { requirement: ["React", "TypeScript"] } }
  - Parse response.postings, check totalPages
  - Rate limiting: 1s delay between pages
  ↓
For each posting, processOfferForDatabase():
  - normalizeWorkplaceType() → analyze places + hybridDesc
  - normalizeExperienceLevel() → map seniority array
  - normalizeSalary() → extract from/to/currency/type
  - normalizeLocation() → extract city from first non-Remote place
  - mapTilesToTechnologies() → filter tiles by type === "requirement"
  - convertToOfferInsert() → build OfferInsert with all normalized fields
  - Return { offer, technologies }
  ↓
ScrapingService handles persistence (existing, no changes):
  - generateOfferEmbeddings()
  - saveOffers() (upsert by offer_url)
  - buildTechnologyLinks()
  - linkTechnologiesToOffers()
  ↓
Return { success: true, runId, offersCount }
```

---

## Implementation Steps

### Step 1: Create NoFluffJobs Type Definitions

**File to create**: `packages/scraper/src/types/no-fluff-jobs.ts`

```typescript
export interface NoFluffJobsCountry {
  code: string;
  name: string;
}

export interface NoFluffJobsPlace {
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

export interface NoFluffJobsSearchResponse {
  postings: NoFluffJobsPosting[];
  totalCount: number;
  totalPages: number;
  exactMatchesPages: number;
  rawSearch: string;
  locationCriteria: boolean;
}

export const NO_FLUFF_JOBS_CATEGORIES = [
  "backend",
  "frontend",
  "fullstack",
  "devops",
  "mobile",
  "testing",
  "data",
  "security",
  "ux",
  "agile",
  "architecture",
  "artificialIntelligence",
  "automation",
  "businessAnalyst",
  "businessIntelligence",
  "consulting",
  "customerService",
  "electricalEng",
  "electronics",
  "embedded",
  "erp",
  "finance",
  "gameDev",
  "hr",
  "law",
  "logistics",
  "marketing",
  "mechanics",
  "officeAdministration",
  "other",
  "productManagement",
  "projectManager",
  "sales",
  "support",
  "sysAdministrator",
  "telecommunication",
] as const;

export type NoFluffJobsCategory = (typeof NO_FLUFF_JOBS_CATEGORIES)[number];
```

### Step 2: Create NoFluffJobs Validation Schema

**File to create**: `packages/scraper/src/schemas/nofluffjobs.ts`

```typescript
import { z } from "zod";

export const noFluffJobsProviderOptionsSchema = z.object({
  salaryCurrency: z.enum(["PLN", "USD", "EUR"]).optional(),
  salaryPeriod: z.enum(["month", "hour"]).optional(),
  region: z.string().optional(),
});

export type NoFluffJobsProviderOptions = z.infer<
  typeof noFluffJobsProviderOptionsSchema
>;
```

### Step 3: Update Base Schema Exports

**File to modify**: `packages/scraper/src/schemas/base-schemas.ts`

Add at the end:
```typescript
export * from "./nofluffjobs";
```

### Step 4: Implement NoFluffJobs Strategy

**File to create**: `packages/scraper/src/strategies/no-fluff-jobs/no-fluff-jobs.strategy.ts`

This is the core implementation. Follow the EXACT same structure as `just-join-it.strategy.ts`.

**Constants**:
```typescript
const API_BASE_URL = "https://nofluffjobs.com/api/search/posting";
const LOGO_BASE_URL = "https://nofluffjobs.com/";

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
```

**Note on rate limiting**: Use 1500ms (slightly more conservative than JustJoinIt's 1000ms) since this is an undocumented internal API.

**Class structure**:

```typescript
export class NoFluffJobsStrategy implements ScrapingStrategy<string> {
  private readonly options: Required<Omit<ScrapingOptions, "providerOptions">>;
  private readonly providerOptions: Required<NoFluffJobsProviderOptions>;

  constructor(options?: ScrapingOptions) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
    this.providerOptions = {
      ...DEFAULT_PROVIDER_OPTIONS,
      ...this.mapProviderOptions(options?.providerOptions as BaseProviderOptions | undefined),
    };
  }
```

**Key method implementations**:

#### `mapProviderOptions()`
Map from `BaseProviderOptions` to `NoFluffJobsProviderOptions`:
- `baseOptions.currency` → `salaryCurrency` (uppercase: "pln" → "PLN")
- Other fields are NoFluffJobs-specific (no direct base mapping)

#### `fetchOffers(page, skills)`
```typescript
private async fetchOffers(
  page: number,
  skills: string[]
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
      requirement: skills,
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
```

#### `normalizeWorkplaceType()`
```typescript
private normalizeWorkplaceType(
  posting: NoFluffJobsPosting
): "remote" | "hybrid" | "office" {
  const places = posting.location.places;
  const cities = places
    .map((p) => p.city)
    .filter((c): c is string => c !== undefined && c !== null);

  const hasRemote = cities.includes("Remote");
  const physicalCities = cities.filter((c) => c !== "Remote");
  const hasPhysical = physicalCities.length > 0;
  const hasHybridDesc = posting.location.hybridDesc.length > 0;

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
```

#### `normalizeExperienceLevel()`
```typescript
private normalizeExperienceLevel(seniority: string[]): ExperienceLevel {
  const SENIORITY_PRIORITY: Record<string, ExperienceLevel> = {
    Expert: "senior",
    Senior: "senior",
    Mid: "mid",
    Junior: "junior",
    Trainee: "junior",
  };

  const LEVEL_ORDER: ExperienceLevel[] = ["junior", "mid", "senior"];

  let highest: ExperienceLevel = "junior";
  for (const s of seniority) {
    const mapped = SENIORITY_PRIORITY[s];
    if (mapped && LEVEL_ORDER.indexOf(mapped) > LEVEL_ORDER.indexOf(highest)) {
      highest = mapped;
    }
  }

  return highest;
}
```

#### `normalizeEmploymentType()`
```typescript
private normalizeEmploymentType(
  type: string
): "b2b" | "permanent" | "mandate_contract" | undefined {
  const EMPLOYMENT_MAP: Record<string, "b2b" | "permanent" | "mandate_contract"> = {
    b2b: "b2b",
    permanent: "permanent",
    zlecenie: "mandate_contract",
    uod: "mandate_contract",
    intern: "permanent",
  };

  return EMPLOYMENT_MAP[type];
}
```

#### `normalizeSalary()`
```typescript
private normalizeSalary(salary: NoFluffJobsSalary | null) {
  if (!salary || !salary.from) {
    return this.getEmptySalary();
  }

  return {
    from: salary.from,
    to: salary.to,
    currency: salary.currency?.toUpperCase(),
    period: "month" as SalaryPeriod,
    type: this.normalizeEmploymentType(salary.type),
  };
}
```

#### `normalizeLocation()`
```typescript
private normalizeLocation(posting: NoFluffJobsPosting): LocationInfo {
  const physicalPlace = posting.location.places.find(
    (p) => p.city && p.city !== "Remote" && !p.provinceOnly
  );

  return {
    city: physicalPlace?.city ?? null,
    street: physicalPlace?.street ?? null,
  };
}
```

#### `mapTilesToTechnologies()`
```typescript
private mapTilesToTechnologies(
  tiles: NoFluffJobsTiles
): TechnologyData[] {
  return tiles.values
    .filter((tile) => tile.type === "requirement")
    .map((tile) => ({
      technology_name: tile.value,
      skill_level: "required" as SkillLevel,
    }));
}
```

#### `convertToOfferInsert()`
```typescript
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
    published_at: new Date(apiOffer.posted).toISOString(),
    expires_at: undefined,
    last_published_at: new Date(apiOffer.renewed).toISOString(),
    company_logo_thumb_url: logoUrl,
    application_url: `https://nofluffjobs.com/pl/job/${apiOffer.url}`,
  };
}
```

**IMPORTANT**: The offer URL format is `https://nofluffjobs.com/pl/job/{url}` — this is the user-facing URL on the website.

#### `fetchAllOffers()`
```typescript
private async fetchAllOffers(skills: string[]): Promise<NoFluffJobsPosting[]> {
  const apiOffers: NoFluffJobsPosting[] = [];
  let currentPage = 1;

  for (let i = 0; i < this.options.maxIterations; i++) {
    const response = await this.fetchOffers(currentPage, skills);
    apiOffers.push(...response.postings);

    if (this.shouldStopFetching(apiOffers, response.totalPages, currentPage)) {
      break;
    }

    currentPage++;

    if (i < this.options.maxIterations - 1) {
      await sleep(RATE_LIMIT_DELAY_MS);
    }
  }

  return apiOffers;
}
```

#### `shouldStopFetching()`
```typescript
private shouldStopFetching(
  apiOffers: NoFluffJobsPosting[],
  totalPages: number,
  currentPage: number
): boolean {
  return apiOffers.length >= this.options.maxOffers || currentPage >= totalPages;
}
```

#### `getOffers()` (public interface)
```typescript
async getOffers(
  skills: string[],
  scrapingRunId: number
): Promise<PreparedOfferData[]> {
  const apiOffers = await this.fetchAllOffers(skills);

  return executeInBatches(
    apiOffers,
    (apiOffer) => this.processOfferForDatabase(apiOffer, scrapingRunId),
    this.options.concurrencyLimit
  );
}
```

### Step 5: Register Strategy in Factory

**File to modify**: `packages/scraper/src/strategies/strategy-factory.ts`

Changes:
1. Add import: `import { NoFluffJobsStrategy } from "./no-fluff-jobs/no-fluff-jobs.strategy";`
2. Add to strategies map: `nofluffjobs: NoFluffJobsStrategy,`

### Step 6: Update AVAILABLE_JOB_BOARDS

**File to modify**: `packages/scraper/src/types/scraper-types.ts`

Change line 59:
```typescript
export const AVAILABLE_JOB_BOARDS = ["justjoinit", "nofluffjobs"] as const;
```

### Step 7: Update Consumer for Dual-Board Scraping

**File to modify**: `apps/web/src/features/dashboard/api/scrape-and-match.ts`

In the `executeMatchingFlow` function, replace the single `scrapeOffers` call (around line 121-126) with sequential dual-board scraping:

```typescript
const categories = mapSkillsToCategories(userSkills);

const justjoinitResult = await scrapeOffers({
  board: "justjoinit",
  maxOffers: 500,
  categories: categories.length > 0 ? categories : undefined,
});

const nofluffjobsResult = await scrapeOffers({
  board: "nofluffjobs",
  maxOffers: 500,
  categories: userSkills,
});

const scrapeSuccess = justjoinitResult.success || nofluffjobsResult.success;
const totalScraped = (justjoinitResult.offersCount ?? 0) + (nofluffjobsResult.offersCount ?? 0);

if (!scrapeSuccess) {
  // Both failed
  await updateMatchRun(supabase, matchRunId, {
    status: "failed",
    errorMessage: justjoinitResult.error ?? nofluffjobsResult.error ?? "Scraping failed",
  });
  return err(justjoinitResult.error ?? nofluffjobsResult.error ?? "Failed to scrape jobs");
}
```

Then update the rest of the function to use `totalScraped` for the `scrapedCount` in the result.

**Key behavior**: Even if one board fails, the other board's results are still used. Both boards must fail for the scrape step to be considered failed.

### Step 8: Build and Validate

Run the full validation suite:
```bash
pnpm run build
pnpm run check-types
pnpm run lint
pnpm run knip
```

---

## Files Summary

### Files to Create (3)
| File | Purpose |
|------|---------|
| `packages/scraper/src/types/no-fluff-jobs.ts` | API response type definitions + category const array |
| `packages/scraper/src/schemas/nofluffjobs.ts` | Zod validation for provider options |
| `packages/scraper/src/strategies/no-fluff-jobs/no-fluff-jobs.strategy.ts` | Full strategy implementation |

### Files to Modify (4)
| File | Changes |
|------|---------|
| `packages/scraper/src/schemas/base-schemas.ts` | Add `export * from "./nofluffjobs"` |
| `packages/scraper/src/strategies/strategy-factory.ts` | Import + register NoFluffJobsStrategy |
| `packages/scraper/src/types/scraper-types.ts` | Add `"nofluffjobs"` to AVAILABLE_JOB_BOARDS |
| `apps/web/src/features/dashboard/api/scrape-and-match.ts` | Sequential dual-board scraping |

### Files NOT to Modify
- No database migration needed (same offers table schema)
- No dashboard UI changes (offers display identically regardless of source)
- No embeddings package changes (ScrapingService generates embeddings)
- No skill-category-map.ts changes (NoFluffJobs uses direct skill keywords)

---

## Critical Implementation Details

### Offer URL Format

The user-facing URL for NoFluffJobs is: `https://nofluffjobs.com/pl/job/{url}`
Where `{url}` is the `url` field from the posting object (e.g., `lead-javascript-engineer-winged-it-warszawa`).

This is used for both `offer_url` (unique constraint for dedup) and `application_url`.

### Technology Extraction

From `tiles.values`, only include items where `type === "requirement"`. Exclude `type === "category"` (too broad, e.g., "fullstack") and `type === "jobLanguage"` (not a tech skill).

All technologies from NoFluffJobs are mapped as `skill_level: "required"` since the listing API doesn't distinguish required vs nice-to-have (that data is only in the detail endpoint which we don't use).

### Salary Period

The search API normalizes all salaries to the requested `salaryPeriod` query param. We always request `month`, so all `salary.from`/`salary.to` values are monthly. Store as `salary_period: "month"`.

### Timestamp Handling

NoFluffJobs `posted` and `renewed` fields are Unix timestamps in **milliseconds**. Convert with `new Date(timestamp).toISOString()`.

### Location Edge Cases

- Multiple places with `provinceOnly: true` — ignore these, they're province-level entries for remote jobs in Poland
- Place with no `city` — skip when looking for physical location
- Place with `city === "Remote"` — this is the remote indicator, not a physical city
- The `normalizeLocation()` should find the first non-Remote, non-provinceOnly place for the city

### Working Time

NoFluffJobs doesn't have a working time field in the listing API. Default to `"full_time"` since the vast majority of IT positions on the platform are full-time.

### Empty Skills Array

If `getOffers()` is called with an empty skills array `[]`, the NoFluffJobs search API returns ALL postings (unfiltered). This is fine — the matching pipeline will handle relevance.

### Error Handling

Follow the exact same patterns as JustJoinIt:
- Network errors: throw `Error` with descriptive message (caught by `ScrapingService`)
- Missing salary: return `getEmptySalary()` with all undefined fields
- No postings returned: return empty `PreparedOfferData[]` (ScrapingService handles 0-count gracefully)
- Failed embeddings: handled by ScrapingService (skip silently)
- Failed technology lookups: handled by ScrapingService (skip silently)

### Performance Budget

- Pages per scrape: ~4 pages (500 offers / 120 per page)
- Rate limiting: 1.5s between pages
- Estimated fetch time: ~6-8 seconds (4 pages × 1.5s + HTTP latency)
- Batch processing: 5 concurrent normalizations
- Total scrape time (NoFluffJobs only): ~8-12 seconds
- Total dual-board time: ~15-25 seconds (sequential, both boards)

---

## Existing Code Patterns to Follow

1. **Class-based strategy**: Constructor takes optional `ScrapingOptions`, public `getOffers()` method
2. **Default options pattern**: Spread defaults with overrides: `{ ...DEFAULT_OPTIONS, ...options }`
3. **Provider options mapping**: `mapProviderOptions()` translates `BaseProviderOptions` to provider-specific
4. **Private normalization methods**: Each field has its own normalize method
5. **Rate limiting**: `await sleep(RATE_LIMIT_DELAY_MS)` between API calls
6. **Batch processing**: `executeInBatches(items, fn, concurrency)` for data transformation
7. **Error format**: `throw new Error(\`API request failed: ${status} ${statusText}\`)`
8. **Empty salary**: `getEmptySalary()` returns object with all undefined fields
9. **No console.log**: Project convention — no logging in production code
10. **No comments**: Project convention — self-documenting code preferred
11. **Import type**: Use `import type` for type-only imports
12. **File naming**: Kebab-case: `no-fluff-jobs.strategy.ts`, `no-fluff-jobs.ts`

---

## Validation Checklist

After implementation, verify:

- [ ] `pnpm run build` passes (all packages)
- [ ] `pnpm run check-types` passes
- [ ] `pnpm run lint` passes
- [ ] `pnpm run knip` passes (no unused exports)
- [ ] `AVAILABLE_JOB_BOARDS` includes `"nofluffjobs"`
- [ ] Strategy factory returns `NoFluffJobsStrategy` for `board: "nofluffjobs"`
- [ ] `NoFluffJobsStrategy.getOffers()` returns `PreparedOfferData[]`
- [ ] Workplace type logic handles all 4 cases (remote, hybrid via places, hybrid via desc, office)
- [ ] Seniority mapping handles all 5 levels including multiple values
- [ ] Employment type mapping handles all 5 NoFluffJobs types
- [ ] Offer URL uses `https://nofluffjobs.com/pl/job/{url}` format
- [ ] Logo URL uses `https://nofluffjobs.com/{relative_path}` format
- [ ] Timestamps converted from ms to ISO string
- [ ] Technologies extracted only from tiles with `type === "requirement"`
- [ ] Consumer calls both boards sequentially (JustJoinIt first, then NoFluffJobs)
- [ ] Consumer handles partial failure (one board fails, other succeeds)

---

## Post-Implementation

### Quality Review

After implementation is complete, run the `/feature-dev:code-review` skill to review:
1. **Simplicity/DRY/Elegance** — Check for code duplication, unnecessary abstractions
2. **Bugs/Functional Correctness** — Verify normalization logic, pagination, error paths
3. **Project Conventions** — Ensure naming, imports, co-location patterns follow CLAUDE.md

### Update tasks.md

After all validation passes and code review is done, update the following in `/Users/kubunito/Prywatne/codeforge-v2/tasks.md`:
1. Mark tasks 11.1 through 11.9 with `[x]` as complete
2. Add "What was built" summary section under Milestone 11
3. Add "Files created" and "Files modified" lists
4. Update the Summary table to show M11 as "✅ Complete"
5. Update the next milestone indicator

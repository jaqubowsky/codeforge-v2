# Scraper Package - CLAUDE.md

Core scraping library for extracting, normalizing, and persisting job listings with embeddings.

## Commands

```bash
pnpm build        # Compile TypeScript to dist/
pnpm check-types  # TypeScript validation
```

## Package Structure

```
src/
├── controllers/
│   └── scrape-for-user.ts              # Main entry point (scrapeOffers)
├── services/
│   └── scraping.service.ts             # Core orchestration logic
├── strategies/
│   ├── strategy-factory.ts             # Factory for instantiating board strategies
│   ├── just-join-it/
│   │   └── just-join-it.strategy.ts    # JustJoinIt API implementation
│   └── no-fluff-jobs/
│       └── no-fluff-jobs.strategy.ts   # NoFluffJobs API implementation
├── types/
│   ├── scraper-types.ts                # Core type definitions + DB enum aliases
│   ├── just-join-it.ts                 # JustJoinIt API response types
│   └── no-fluff-jobs.ts               # NoFluffJobs API response types
├── schemas/
│   ├── base-schemas.ts                 # Base Zod validation schemas
│   ├── justjoinit.ts                   # JustJoinIt-specific schemas
│   └── nofluffjobs.ts                  # NoFluffJobs-specific schemas
├── utils/
│   ├── batch-processor.ts              # Concurrent batch execution
│   ├── errors.ts                       # Custom error classes
│   ├── skill-category-map.ts           # Maps user skills to JustJoinIt categories
│   └── sleep.ts                        # Async delay utility
└── index.ts                            # Barrel export: scrapeOffers, mapSkillsToCategories
```

## Public API

```typescript
import { scrapeOffers, mapSkillsToCategories } from "@codeforge-v2/scraper";

const result = await scrapeOffers({
  board: "justjoinit",   // "justjoinit" | "nofluffjobs" (default: "justjoinit")
  maxOffers: 500,         // Max offers to scrape (default: 500)
  categories: ["react"],  // Technology filters (optional)
});

// Result: { success, runId?, offersCount?, error? }

// Map user skill strings to JustJoinIt category slugs
const categories = mapSkillsToCategories(["react", "typescript"]);
// Returns: ["javascript"]
```

## Architecture

### Strategy Pattern

Pluggable strategies for different job boards. Each strategy implements `ScrapingStrategy<TTechnology>`:

```
ScrapingStrategy<string> interface
  → JustJoinItStrategy (ScrapingStrategy<JustJoinItTechnology>)
  → NoFluffJobsStrategy (ScrapingStrategy<string>)
```

The factory returns `ScrapingStrategy<string>` to provide a unified interface.

### Scraping Pipeline

1. **Create scraping run** - Register session in database
2. **Fetch offers** - Get listings from API via strategy
3. **Normalize data** - Transform API response to database schema
4. **Generate embeddings** - Create vectors via `@codeforge-v2/embeddings`
5. **Save offers** - Upsert to database (by offer_url unique constraint)
6. **Link technologies** - Associate skills/tech with offers
7. **Update run status** - Mark completed/failed

### JustJoinIt Implementation

- **API**: `https://justjoin.it/api/candidate-api/offers` (GET)
- **Pagination**: Cursor-based, 100 items/page
- **Rate limiting**: 1s delay between requests
- **Categories**: Technology slugs (ai, javascript, python, java, etc.)

### NoFluffJobs Implementation

- **API**: `https://nofluffjobs.com/api/search/posting` (POST)
- **Pagination**: Page-based, 120 items/page
- **Rate limiting**: 1.5s delay between requests
- **Categories**: Raw skill strings passed as search requirements

## Type Safety Guidelines

### Use named types from DB enums (never inline string literal unions)

`scraper-types.ts` exports named aliases for all DB enums:

```typescript
EmploymentType  // "permanent" | "b2b" | "internship" | "mandate_contract"
ExperienceLevel // "junior" | "mid" | "senior" | "c-level" | null
SalaryPeriod    // "day" | "month" | "hour" | "year" | null
SkillLevel      // "required" | "nice_to_have"
WorkingTime     // "full_time" | "part_time" | "b2b" | "internship" | "freelance"
WorkplaceType   // "remote" | "hybrid" | "office"
```

Use these in maps, return types, and variables instead of writing out the string union inline.

### Avoid type assertions (`as`) - use validation or typed variables instead

- **Provider options**: Use `baseProviderOptionsSchema.parse()` to validate `Record<string, unknown>` instead of casting with `as BaseProviderOptions`
- **Literal values**: Use typed variables (`const period: SalaryPeriod = "month"`) instead of `"month" as SalaryPeriod`
- **Mapping constants**: Use typed `Record<string, EmploymentType>` maps instead of inline union value types
- **External API responses**: `response.json() as Promise<T>` is the one acceptable use of `as` (external API boundary, no control over the type)
- **Embeddings**: Use `JSON.stringify(embedding)` to convert `number[]` to the DB `string` type instead of casting the offer to `Record<string, unknown>`

### Use explicit return type annotations to avoid `as const` on values

```typescript
// Instead of: skill_level: "required" as const
.map((tile): TechnologyData => ({
  technology_name: tile.value,
  skill_level: "required",
}));
```

## Adding a New Job Board

1. Create type file: `src/types/[board].ts` (API response types)
2. Create schema: `src/schemas/[board].ts` (Zod validation for provider options)
3. Implement strategy: `src/strategies/[board]/[board].strategy.ts`
4. Register in factory: `src/strategies/strategy-factory.ts`
5. Add board to `AVAILABLE_JOB_BOARDS` in `src/types/scraper-types.ts`

## Dependencies

- `@codeforge-v2/database` - DB queries and types
- `@codeforge-v2/embeddings` - Vector embedding generation
- `zod` - Validation (used for provider option parsing in strategies)

## Error Handling

- Custom error classes: `ScraperError`, `BadRequestError`, `NotFoundError`
- Failed embeddings are skipped (non-blocking)
- Run status tracks success/failure in database

## Consumer

Used by `apps/web` in `scrape-and-match.ts` server action: scrapes both justjoinit and nofluffjobs boards, then matches offers to user profile via cross-encoder re-ranking.

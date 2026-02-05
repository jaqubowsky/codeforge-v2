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
│   └── scrape-for-user.ts          # Main entry point (scrapeOffers)
├── services/
│   └── scraping.service.ts         # Core orchestration logic
├── strategies/
│   ├── strategy-factory.ts         # Factory for instantiating board strategies
│   └── just-join-it/
│       └── just-join-it.strategy.ts # JustJoinIt API implementation
├── types/
│   ├── scraper-types.ts            # Core type definitions
│   └── just-join-it.ts             # JustJoinIt API response types
├── schemas/
│   ├── base-schemas.ts             # Base Zod validation schemas
│   └── justjoinit.ts               # JustJoinIt-specific schemas
├── utils/
│   ├── batch-processor.ts          # Concurrent batch execution
│   ├── errors.ts                   # Custom error classes
│   └── sleep.ts                    # Async delay utility
└── index.ts                        # Barrel export: scrapeOffers only
```

## Public API

```typescript
import { scrapeOffers } from "@codeforge-v2/scraper";

const result = await scrapeOffers({
  board: "justjoinit",   // Job board (default: "justjoinit")
  maxOffers: 500,         // Max offers to scrape (default: 500)
});

// Result: { success, runId?, offersCount?, error? }
```

## Architecture

### Strategy Pattern

Pluggable strategies for different job boards. Each strategy implements `ScrapingStrategy<TTechnology>`:

```
ScrapingStrategy interface → JustJoinItStrategy (active)
                           → [future board strategies]
```

### Scraping Pipeline

1. **Create scraping run** → Register session in database
2. **Fetch offers** → Get listings from API via strategy
3. **Normalize data** → Transform API response to database schema
4. **Generate embeddings** → Create vectors via `@codeforge-v2/embeddings`
5. **Save offers** → Upsert to database (by offer_url unique constraint)
6. **Link technologies** → Associate skills/tech with offers
7. **Update run status** → Mark completed/failed

### JustJoinIt Implementation

- **API**: `https://justjoin.it/api/candidate-api/offers`
- **Pagination**: Cursor-based, 100 items/page
- **Rate limiting**: 1s delay between requests
- **Concurrency**: Batch processing (default: 5)
- **Technologies scraped**: ai, javascript, html, php, ruby, python, java, net, scala, c, mobile, testing, devops, admin, ux, pm, game, analytics, security, data, go, support, erp, architecture, other

## Adding a New Job Board

1. Create type file: `src/types/[board].ts` (API response types)
2. Create schema: `src/schemas/[board].ts` (Zod validation)
3. Implement strategy: `src/strategies/[board]/[board].strategy.ts`
4. Register in factory: `src/strategies/strategy-factory.ts`
5. Add board to `AVAILABLE_JOB_BOARDS` in `src/types/scraper-types.ts`

## Dependencies

- `@codeforge-v2/database` - DB queries and types
- `@codeforge-v2/embeddings` - Vector embedding generation
- `zod` - Validation

## Error Handling

- Custom error classes: `ScraperError`, `BadRequestError`, `NotFoundError`
- Failed embeddings are skipped (non-blocking)
- Run status tracks success/failure in database

## Consumer

Used by `apps/web` in `scrape-and-match.ts` server action: triggers scraping, then matches offers to user profile.

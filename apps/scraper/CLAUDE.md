# Scraper - CLAUDE.md

Google Cloud Functions serverless scraper using Playwright and Zod validation.

## Commands

```bash
npm run dev:scraper  # Run scraper function locally (port 8080)
npm run build        # Compile TypeScript to dist/
npm run check-types  # TypeScript validation
```

**Local testing**:
```bash
# Starts Cloud Functions emulator on port 8080
npm run dev:scraper

# Then trigger via HTTP:
curl http://localhost:8080
```

## Architecture

**Strategy pattern** for different job boards:

```
src/
├── strategies/          # Job board scrapers
│   ├── justjoinit.ts   # JustJoinIT scraper
│   └── [board].ts      # Add new boards here
├── services/            # Orchestration layer
│   └── scraper.ts      # Main scraper service
├── schemas/             # Zod validation schemas
│   └── offer.ts        # Job offer schema
└── index.ts             # Cloud Function entry point
```

**Flow**:
1. Cloud Function triggered (HTTP or scheduled)
2. Service layer calls strategy for specific board
3. Strategy uses Playwright to scrape
4. Data validated with Zod schema
5. Valid offers stored in Supabase

## Adding a New Job Board

1. **Create strategy** in `src/strategies/[board-name].ts`:
   ```typescript
   import type { Page } from "playwright-core";
   import { offerSchema } from "../schemas/offer";

   export async function scrape[BoardName](page: Page, technology: string) {
     await page.goto(`https://[board].com/jobs/${technology}`);
     // Scraping logic
     const rawData = await page.evaluate(() => { /* ... */ });

     // Validate with Zod
     return rawData.map(item => offerSchema.parse(item));
   }
   ```

2. **Update service** in `src/services/scraper.ts` to call new strategy

3. **Test locally** with `npm run dev:scraper`

## Playwright + Chromium

Uses `playwright-core` with `@sparticuz/chromium` for AWS Lambda/Cloud Functions compatibility.

**Gotcha**: In Cloud Functions, Chromium binary must be bundled. The `@sparticuz/chromium` package handles this automatically.

## Zod Schemas

All external data must be validated:

```typescript
import { z } from "zod";

export const offerSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string(),
  // ... more fields
});

// Use .parse() to throw on invalid data
// Use .safeParse() for error handling
const result = offerSchema.safeParse(rawData);
if (!result.success) {
  console.error("Validation failed:", result.error);
}
```

## Environment Setup

Copy `.env.example` to `.env`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

**Important**: Scraper uses `adminClient` from `@codeforge-v2/database` for write access (requires `SUPABASE_SERVICE_KEY`).

## Deployment

This is configured for Google Cloud Functions. See `ARCHITECTURE.md` for detailed deployment instructions.

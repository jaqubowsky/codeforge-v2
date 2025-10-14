# Scraper Architecture

## Overview
This scraper follows **Clean Architecture** principles with the **Strategy Pattern** for source-specific implementations. The architecture ensures clear separation of concerns, high testability, and easy extensibility.

## Architecture Layers

```
┌─────────────────────────────────────┐
│  Controller Layer (HTTP/API)        │  ← Thin HTTP entrypoint
├─────────────────────────────────────┤
│  Service Layer (Business Logic)     │  ← Orchestration & workflows
├─────────────────────────────────────┤
│  Strategy Layer (Domain Logic)      │  ← Source-specific scraping
├─────────────────────────────────────┤
│  Data Layer (Database)               │  ← Persistence
└─────────────────────────────────────┘
```

## Layer Responsibilities

### 1. **Controller Layer** (`src/controllers/`)
**Purpose:** HTTP request/response handling (thin layer)

**Responsibilities:**
- Validate HTTP input (query params, body)
- Instantiate strategy and service
- Return HTTP responses
- Handle HTTP-specific concerns

**Does NOT:**
- Contain business logic
- Perform database operations
- Transform data

**Example:**
```typescript
export const getOffersByTechnology: HttpFunction = withError(
  async (req, res) => {
    // 1. Validate input
    const result = schema.safeParse(req.query);
    if (!result.success) throw new ValidationError(...);

    // 2. Instantiate strategy & service
    const strategy = new JustJoinItStrategy();
    const service = new ScrapingService(strategy);

    // 3. Call service
    const { runId, offersCount } = await service.scrapeOffersByTechnology(technology);

    // 4. Return HTTP response
    return successResponse(res, { message, data: { runId } });
  }
);
```

### 2. **Service Layer** (`src/services/`)
**Purpose:** Business logic orchestration

**Responsibilities:**
- Create and manage scraping runs
- Orchestrate the scraping workflow
- Save offers to database
- Link technologies to offers
- Handle success/failure states
- Manage transactions and error recovery

**Does NOT:**
- Know about HTTP (no req/res)
- Know about specific sources (uses strategy abstraction)
- Parse source-specific data

**Key Methods:**
- `scrapeOffersByTechnology()` - Main orchestration
- `saveOffers()` - Persist offers
- `buildTechnologyLinks()` - Create technology associations
- `linkTechnologiesToOffers()` - Persist technology links
- `updateScrapingRunSuccess/Failure()` - Update run status

**Example:**
```typescript
export class ScrapingService {
  constructor(private readonly strategy: ScrapingStrategy) {}

  async scrapeOffersByTechnology(technology: string) {
    // 1. Create scraping run
    const scrapingRun = await queries.scraping_runs.create(...);

    // 2. Use strategy to get data
    const preparedData = await this.strategy.getOffersByTechnology(
      technology,
      scrapingRun.id
    );

    // 3. Save to database
    const offers = await this.saveOffers(preparedData, scrapingRun.id);

    // 4. Link technologies
    await this.linkTechnologiesToOffers(...);

    // 5. Update run status
    await this.updateScrapingRunSuccess(...);
  }
}
```

### 3. **Strategy Layer** (`src/strategies/`)
**Purpose:** Source-specific data fetching and normalization

**Responsibilities:**
- Fetch data from specific sources (API, web scraping, etc.)
- Parse source-specific response formats
- Normalize source data to database format
- Return `PreparedOfferData[]` ready for insertion

**Does NOT:**
- Perform database operations (service handles this)
- Know about scraping runs management
- Contain HTTP logic

**Contract:**
```typescript
interface ScrapingStrategy {
  getOffersByTechnology(
    technology: string,
    scrapingRunId: number
  ): Promise<PreparedOfferData[]>;
}
```

**Example:** `JustJoinItStrategy`
- Fetches from JustJoin.it API
- Normalizes JustJoinIt-specific fields
- Returns database-ready `PreparedOfferData[]`

### 4. **Types Layer** (`src/types/`)
**Purpose:** Centralized type definitions

**Contains:**
- Database types (from Supabase schema)
- Strategy contract types (`PreparedOfferData`, `TechnologyData`)
- Source-specific types (e.g., `JustJoinItOffer`)

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      HTTP Request                           │
│                    (GET /offers?tech=react)                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   CONTROLLER LAYER                          │
│  - Validates input                                          │
│  - Creates strategy instance                                │
│  - Creates service with strategy                            │
│  - Returns HTTP response                                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                            │
│  - Creates scraping run                                     │
│  - Calls strategy.getOffersByTechnology()                   │
│  - Saves offers to database                                 │
│  - Links technologies                                       │
│  - Updates scraping run status                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   STRATEGY LAYER                            │
│  - Fetches from source (API/scraping)                       │
│  - Normalizes source data                                   │
│  - Returns PreparedOfferData[]                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                           │
│  - offers table                                             │
│  - technologies table                                       │
│  - offer_technologies table                                 │
│  - scraping_runs table                                      │
└─────────────────────────────────────────────────────────────┘
```

## Adding a New Strategy (e.g., NoFluffJobs)

### 1. Create source-specific types
```typescript
// src/types/nofluffjobs.ts
export type NoFluffJobsOffer = {
  // Source-specific API response fields
  id: string;
  title: string;
  // ... other fields
};
```

### 2. Implement the strategy
```typescript
// src/strategies/nofluffjobs/nofluffjobs.strategy.ts
export class NoFluffJobsStrategy implements ScrapingStrategy {
  async getOffersByTechnology(
    technology: string,
    scrapingRunId: number
  ): Promise<PreparedOfferData[]> {
    // 1. Fetch from NoFluffJobs API
    const apiOffers = await this.fetchOffers(technology);

    // 2. Convert each offer
    return apiOffers.map(apiOffer => {
      const offerInsert = this.convertToOfferInsert(apiOffer, scrapingRunId);
      const technologies = this.extractTechnologies(apiOffer);

      return {
        offer: offerInsert,
        technologies,
      };
    });
  }

  // Source-specific private methods
  private convertToOfferInsert(
    apiOffer: NoFluffJobsOffer,
    scrapingRunId: number
  ): OfferInsert {
    // NoFluffJobs-specific normalization
    return {
      title: apiOffer.title,
      scraping_run_id: scrapingRunId,
      // ... map other fields
    };
  }

  private extractTechnologies(apiOffer: NoFluffJobsOffer): TechnologyData[] {
    // Extract and map technologies
    return apiOffer.skills.map(skill => ({
      technology_name: skill.name,
      skill_level: skill.required ? 'required' : 'nice_to_have',
    }));
  }
}
```

### 3. Use in controller (no changes needed!)
```typescript
// Just swap the strategy - everything else stays the same
const strategy = new NoFluffJobsStrategy(); // New strategy
const service = new ScrapingService(strategy);
const result = await service.scrapeOffersByTechnology(technology);
// All database operations remain identical!
```

## Key Benefits

### ✅ Separation of Concerns
- **Controller** = HTTP only (thin layer)
- **Service** = Business logic & orchestration
- **Strategy** = Source-specific scraping
- **Database** = Persistence layer

### ✅ Dependency Injection
- Service receives strategy via constructor
- Easy to swap implementations
- Perfect for testing (inject mocks)

### ✅ Open/Closed Principle
- **Open** for extension: Add new strategies
- **Closed** for modification: Service/Controller unchanged

### ✅ Type Safety
- Strategy contract enforces `PreparedOfferData[]` return type
- Service always receives predictable data structure
- Compile-time guarantees

### ✅ Testability
- **Controller**: Test HTTP handling with mock service
- **Service**: Test business logic with mock strategy
- **Strategy**: Test scraping logic independently
- All layers can be tested in isolation

### ✅ Maintainability
- Clear layer boundaries
- Source-specific logic isolated in strategies
- Business logic centralized in service
- Database operations in one place

### ✅ Scalability
- Add new job boards without touching existing code
- Run multiple strategies in parallel if needed
- Easy to add caching, rate limiting, retry logic

## Design Patterns Used

### 1. **Strategy Pattern**
```typescript
// Define the strategy interface
interface ScrapingStrategy {
  getOffersByTechnology(technology: string, scrapingRunId: number): Promise<PreparedOfferData[]>;
}

// Service depends on abstraction
class ScrapingService {
  constructor(private readonly strategy: ScrapingStrategy) {}
}

// Easy to swap implementations
new ScrapingService(new JustJoinItStrategy());
new ScrapingService(new NoFluffJobsStrategy());
```

### 2. **Dependency Injection**
```typescript
// Controller injects dependencies
const strategy = new JustJoinItStrategy();
const service = new ScrapingService(strategy);
```

### 3. **Layered Architecture (Clean Architecture)**
- Each layer depends only on layers below it
- Business logic independent of frameworks
- Easy to change infrastructure without touching business logic

## Contract Guarantees

### Strategy Contract
```typescript
interface ScrapingStrategy {
  getOffersByTechnology(
    technology: string,
    scrapingRunId: number
  ): Promise<PreparedOfferData[]>;
}
```

**Guarantees:**
- ✅ Always returns `PreparedOfferData[]`
- ✅ Each item has `offer: OfferInsert` (database-ready)
- ✅ Each item has `technologies: TechnologyData[]` (ready for linking)
- ✅ Type-safe at compile time

### Service Contract
```typescript
class ScrapingService {
  async scrapeOffersByTechnology(technology: string): Promise<{
    runId: number;
    offersCount: number;
  }>;
}
```

**Guarantees:**
- ✅ Creates scraping run
- ✅ Saves all offers
- ✅ Links all technologies
- ✅ Updates run status
- ✅ Handles errors gracefully

## Summary

| Layer | Responsibility | Input | Output | Depends On |
|-------|---------------|-------|--------|------------|
| **Controller** | HTTP handling | HTTP Request | HTTP Response | Service |
| **Service** | Business orchestration | Technology name | Run ID & count | Strategy, Database |
| **Strategy** | Source scraping | Technology, Run ID | PreparedOfferData[] | Source API/Website |
| **Database** | Persistence | Queries | Data/Errors | - |

## Example: Complete Flow

```typescript
// 1. HTTP Request arrives
GET /api/offers?technology=react

// 2. Controller validates & delegates
const strategy = new JustJoinItStrategy();
const service = new ScrapingService(strategy);
const result = await service.scrapeOffersByTechnology('react');

// 3. Service orchestrates
// - Creates scraping run
// - Calls strategy.getOffersByTechnology('react', runId)
// - Strategy returns PreparedOfferData[]
// - Service saves offers to DB
// - Service links technologies to offers
// - Service updates scraping run status

// 4. Controller returns response
return { runId: 123, offersCount: 50 };
```

This architecture is **production-ready** and follows industry best practices used by companies like Stripe, AWS, and Shopify.

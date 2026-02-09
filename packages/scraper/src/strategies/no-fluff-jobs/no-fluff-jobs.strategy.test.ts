import { describe, expect, it } from "vitest";
import type { NoFluffJobsPosting } from "../../types/no-fluff-jobs";
import type { PreparedOfferData } from "../../types/scraper-types";
import { NoFluffJobsStrategy } from "./no-fluff-jobs.strategy";

function createTestPosting(
  overrides: Partial<NoFluffJobsPosting> = {}
): NoFluffJobsPosting {
  return {
    id: "test-123",
    name: "Test Company",
    title: "Senior Developer",
    url: "test-job-123",
    category: "backend",
    seniority: ["Senior"],
    fullyRemote: true,
    posted: 1_738_800_000_000,
    renewed: 1_738_800_000_000,
    regions: ["pl"],
    salary: {
      from: 15_000,
      to: 25_000,
      type: "b2b",
      currency: "PLN",
      disclosedAt: "2026-02-06",
      flexibleUpperBound: false,
    },
    location: {
      places: [{ city: "Remote", url: "/remote" }],
      fullyRemote: true,
      covidTimeRemotely: false,
      hybridDesc: "",
    },
    logo: { jobs_listing: "logos/test.png" },
    tiles: {
      values: [
        { value: "TypeScript", type: "requirement" },
        { value: "React", type: "requirement" },
      ],
    },
    ...overrides,
  };
}

const strategy = new NoFluffJobsStrategy() as unknown as {
  processOfferForDatabase: (
    posting: NoFluffJobsPosting,
    scrapingRunId: number
  ) => PreparedOfferData;
  deduplicatePostings: (postings: NoFluffJobsPosting[]) => NoFluffJobsPosting[];
};

describe("NoFluffJobsStrategy", () => {
  describe("date handling", () => {
    it("converts valid Unix timestamps to ISO strings", () => {
      const posted = 1_738_800_000_000;
      const renewed = 1_738_886_400_000;
      const posting = createTestPosting({ posted, renewed });

      const result = strategy.processOfferForDatabase(posting, 1);

      expect(result.offer.published_at).toBe(new Date(posted).toISOString());
      expect(result.offer.last_published_at).toBe(
        new Date(renewed).toISOString()
      );
    });

    it("handles zero timestamps without crashing", () => {
      const posting = createTestPosting({
        posted: 0,
        renewed: 0,
      });

      const result = strategy.processOfferForDatabase(posting, 1);

      expect(result.offer.published_at).toBeUndefined();
      expect(result.offer.last_published_at).toBeUndefined();
    });

    it("handles NaN timestamps without crashing", () => {
      const posting = createTestPosting({
        posted: Number.NaN,
        renewed: Number.NaN,
      });

      const result = strategy.processOfferForDatabase(posting, 1);

      expect(result.offer.published_at).toBeUndefined();
      expect(result.offer.last_published_at).toBeUndefined();
    });

    it("handles Infinity timestamps without crashing", () => {
      const posting = createTestPosting({
        posted: Number.POSITIVE_INFINITY,
        renewed: Number.NEGATIVE_INFINITY,
      });

      const result = strategy.processOfferForDatabase(posting, 1);

      expect(result.offer.published_at).toBeUndefined();
      expect(result.offer.last_published_at).toBeUndefined();
    });

    it("handles negative timestamps without crashing", () => {
      const posting = createTestPosting({
        posted: -1,
        renewed: -1000,
      });

      const result = strategy.processOfferForDatabase(posting, 1);

      expect(result.offer.published_at).toBeDefined();
      expect(result.offer.last_published_at).toBeDefined();
    });
  });

  describe("offer conversion", () => {
    it("maps all required fields correctly", () => {
      const posting = createTestPosting();
      const result = strategy.processOfferForDatabase(posting, 42);

      expect(result.offer.title).toBe("Senior Developer");
      expect(result.offer.company_name).toBe("Test Company");
      expect(result.offer.offer_url).toBe(
        "https://nofluffjobs.com/pl/job/test-job-123"
      );
      expect(result.offer.slug).toBe("test-job-123");
      expect(result.offer.scraping_run_id).toBe(42);
    });

    it("extracts technologies from tiles", () => {
      const posting = createTestPosting();
      const result = strategy.processOfferForDatabase(posting, 1);

      expect(result.technologies).toEqual([
        { technology_name: "TypeScript", skill_level: "required" },
        { technology_name: "React", skill_level: "required" },
      ]);
    });

    it("filters out non-requirement tiles", () => {
      const posting = createTestPosting({
        tiles: {
          values: [
            { value: "TypeScript", type: "requirement" },
            { value: "Backend", type: "category" },
            { value: "English", type: "jobLanguage" },
          ],
        },
      });
      const result = strategy.processOfferForDatabase(posting, 1);

      expect(result.technologies).toEqual([
        { technology_name: "TypeScript", skill_level: "required" },
      ]);
    });
  });

  describe("posting deduplication", () => {
    it("deduplicates postings with same title and company name", () => {
      const warsaw = createTestPosting({
        id: "job-warsaw",
        url: "senior-developer-test-company-warsaw",
      });
      const krakow = createTestPosting({
        id: "job-krakow",
        url: "senior-developer-test-company-krakow",
      });
      const remote = createTestPosting({
        id: "job-remote",
        url: "senior-developer-test-company-remote",
      });

      const result = strategy.deduplicatePostings([warsaw, krakow, remote]);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("job-warsaw");
    });

    it("keeps postings with different titles from same company", () => {
      const frontend = createTestPosting({
        id: "frontend-123",
        title: "Frontend Developer",
      });
      const backend = createTestPosting({
        id: "backend-456",
        title: "Backend Developer",
      });

      const result = strategy.deduplicatePostings([frontend, backend]);

      expect(result).toHaveLength(2);
    });
  });
});

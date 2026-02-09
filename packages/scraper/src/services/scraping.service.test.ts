import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  Offer,
  PreparedOfferData,
  TechnologyData,
  TechnologyLink,
} from "../types/scraper-types";

vi.mock("@codeforge-v2/database", () => ({
  queries: {
    scraping_runs: {
      create: vi.fn().mockResolvedValue({
        data: { id: 1 },
        error: null,
      }),
      update: vi.fn().mockResolvedValue({ error: null }),
    },
    offers: {
      upsertMany: vi.fn(),
    },
    offer_technologies: {
      linkManyToOffer: vi.fn().mockResolvedValue({ error: null }),
    },
    technologies: {
      getOrCreateId: vi.fn(),
    },
  },
}));

vi.mock("@codeforge-v2/embeddings", () => ({
  embeddings: {
    generateEmbedding: vi.fn(),
  },
}));

import { queries } from "@codeforge-v2/database";
import { embeddings } from "@codeforge-v2/embeddings";
import { ScrapingService } from "./scraping.service";

function createPreparedOffer(
  index: number,
  techs: string[] = ["TypeScript"]
): PreparedOfferData {
  return {
    offer: {
      title: `Job ${index}`,
      company_name: `Company ${index}`,
      offer_url: `https://example.com/job-${index}`,
      slug: `job-${index}`,
      scraping_run_id: 1,
      workplace_type: "remote",
      working_time: "full_time",
      experience_level: "mid",
      salary_from: 10_000,
      salary_to: 20_000,
      salary_currency: "PLN",
      salary_period: "month",
    },
    technologies: techs.map(
      (name): TechnologyData => ({
        technology_name: name,
        skill_level: "required",
      })
    ),
  };
}

function createInsertedOffer(index: number, offerId: number): Offer {
  return {
    id: offerId,
    title: `Job ${index}`,
    company_name: `Company ${index}`,
    offer_url: `https://example.com/job-${index}`,
    slug: `job-${index}`,
    scraping_run_id: 1,
    workplace_type: "remote",
    working_time: "full_time",
    experience_level: "mid",
    salary_from: null,
    salary_to: null,
    salary_currency: null,
    salary_period: null,
    employment_type: null,
    city: null,
    street: null,
    published_at: null,
    expires_at: null,
    last_published_at: null,
    company_logo_thumb_url: null,
    application_url: null,
    embedding: null,
  };
}

function mockTechIds(ids: Record<string, number>) {
  vi.mocked(queries.technologies.getOrCreateId).mockImplementation(((
    name: string
  ) =>
    Promise.resolve({
      data: ids[name] ?? null,
      error: null,
    })) as never);
}

function captureTechLinks(): { get: () => TechnologyLink[] } {
  let links: TechnologyLink[] = [];
  vi.mocked(queries.offer_technologies.linkManyToOffer).mockImplementation(((
    captured: TechnologyLink[]
  ) => {
    links = captured;
    return Promise.resolve({ error: null });
  }) as never);
  return { get: () => links };
}

describe("ScrapingService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("technology linking alignment", () => {
    it("links correct technologies when some offers fail embedding generation", async () => {
      const offers = [
        createPreparedOffer(0, ["React"]),
        createPreparedOffer(1, ["Python"]),
        createPreparedOffer(2, ["TypeScript"]),
        createPreparedOffer(3, ["Java"]),
        createPreparedOffer(4, ["Go"]),
      ];

      vi.mocked(embeddings.generateEmbedding)
        .mockResolvedValueOnce([0.1, 0.2])
        .mockRejectedValueOnce(new Error("Embedding failed"))
        .mockResolvedValueOnce([0.3, 0.4])
        .mockRejectedValueOnce(new Error("Embedding failed"))
        .mockResolvedValueOnce([0.5, 0.6]);

      vi.mocked(queries.offers.upsertMany).mockResolvedValue({
        data: [
          createInsertedOffer(0, 100),
          createInsertedOffer(2, 200),
          createInsertedOffer(4, 300),
        ],
        error: null,
      } as never);

      mockTechIds({ React: 10, TypeScript: 20, Go: 30 });
      const captured = captureTechLinks();

      const service = new ScrapingService({
        getOffers: vi.fn().mockResolvedValue(offers),
      });
      await service.scrapeOffers([]);

      const links = captured.get();

      const offer100Links = links.filter((l) => l.offer_id === 100);
      expect(offer100Links).toHaveLength(1);
      expect(offer100Links[0]?.technology_id).toBe(10);

      const offer200Links = links.filter((l) => l.offer_id === 200);
      expect(offer200Links).toHaveLength(1);
      expect(offer200Links[0]?.technology_id).toBe(20);

      const offer300Links = links.filter((l) => l.offer_id === 300);
      expect(offer300Links).toHaveLength(1);
      expect(offer300Links[0]?.technology_id).toBe(30);
    });

    it("does not link technologies from skipped offers to inserted offers", async () => {
      const offers = [
        createPreparedOffer(0, ["SkippedTech"]),
        createPreparedOffer(1, ["CorrectTech"]),
      ];

      vi.mocked(embeddings.generateEmbedding)
        .mockRejectedValueOnce(new Error("Embedding failed"))
        .mockResolvedValueOnce([0.1, 0.2]);

      vi.mocked(queries.offers.upsertMany).mockResolvedValue({
        data: [createInsertedOffer(1, 500)],
        error: null,
      } as never);

      mockTechIds({ SkippedTech: 90, CorrectTech: 91 });
      const captured = captureTechLinks();

      const service = new ScrapingService({
        getOffers: vi.fn().mockResolvedValue(offers),
      });
      await service.scrapeOffers([]);

      const links = captured.get();
      expect(links).toHaveLength(1);
      expect(links[0]).toEqual({
        offer_id: 500,
        technology_id: 91,
        skill_level: "required",
      });

      const wrongLink = links.find((l) => l.technology_id === 90);
      expect(wrongLink).toBeUndefined();
    });

    it("deduplicates offers with the same offer_url before upserting", async () => {
      const duplicate1 = createPreparedOffer(0, ["React"]);
      const duplicate2 = createPreparedOffer(0, ["Vue"]);
      const unique = createPreparedOffer(1, ["TypeScript"]);

      vi.mocked(embeddings.generateEmbedding).mockResolvedValue([0.1, 0.2]);

      vi.mocked(queries.offers.upsertMany).mockResolvedValue({
        data: [createInsertedOffer(0, 100), createInsertedOffer(1, 200)],
        error: null,
      } as never);

      mockTechIds({ Vue: 10, TypeScript: 20 });
      const captured = captureTechLinks();

      const service = new ScrapingService({
        getOffers: vi.fn().mockResolvedValue([duplicate1, duplicate2, unique]),
      });
      const result = await service.scrapeOffers([]);

      expect(result.offersCount).toBe(2);

      const upsertCall = vi.mocked(queries.offers.upsertMany).mock.calls[0];
      const upsertedOffers = upsertCall?.[0];
      expect(upsertedOffers).toHaveLength(2);

      const links = captured.get();
      const offer100Links = links.filter((l) => l.offer_id === 100);
      expect(offer100Links).toHaveLength(1);
      expect(offer100Links[0]?.technology_id).toBe(10);
    });

    it("skips technology linking when all embeddings fail", async () => {
      const offers = [
        createPreparedOffer(0, ["React"]),
        createPreparedOffer(1, ["Python"]),
      ];

      vi.mocked(embeddings.generateEmbedding).mockRejectedValue(
        new Error("Model unavailable")
      );

      vi.mocked(queries.offers.upsertMany).mockResolvedValue({
        data: [],
        error: null,
      } as never);

      const service = new ScrapingService({
        getOffers: vi.fn().mockResolvedValue(offers),
      });
      const result = await service.scrapeOffers([]);

      expect(result.offersCount).toBe(2);
      expect(queries.offer_technologies.linkManyToOffer).not.toHaveBeenCalled();
    });
  });

  describe("salary filtering", () => {
    it("filters out offers without salary_from before saving", async () => {
      const withSalary = createPreparedOffer(0, ["React"]);
      const withoutSalary = createPreparedOffer(1, ["Python"]);
      withoutSalary.offer.salary_from = undefined;

      vi.mocked(embeddings.generateEmbedding).mockResolvedValue([0.1, 0.2]);

      vi.mocked(queries.offers.upsertMany).mockResolvedValue({
        data: [createInsertedOffer(0, 100)],
        error: null,
      } as never);

      mockTechIds({ React: 10 });

      const service = new ScrapingService({
        getOffers: vi.fn().mockResolvedValue([withSalary, withoutSalary]),
      });
      const result = await service.scrapeOffers([]);

      expect(result.offersCount).toBe(1);

      const upsertCall = vi.mocked(queries.offers.upsertMany).mock.calls[0];
      const upsertedOffers = upsertCall?.[0];
      expect(upsertedOffers).toHaveLength(1);
    });

    it("returns zero offers when all offers lack salary", async () => {
      const noSalary1 = createPreparedOffer(0, ["React"]);
      noSalary1.offer.salary_from = undefined;
      const noSalary2 = createPreparedOffer(1, ["Python"]);
      noSalary2.offer.salary_from = undefined;

      const service = new ScrapingService({
        getOffers: vi.fn().mockResolvedValue([noSalary1, noSalary2]),
      });
      const result = await service.scrapeOffers([]);

      expect(result.offersCount).toBe(0);
      expect(queries.offers.upsertMany).not.toHaveBeenCalled();
    });
  });
});

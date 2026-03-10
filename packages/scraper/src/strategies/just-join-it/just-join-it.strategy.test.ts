import { describe, expect, it } from "vitest";
import type { JustJoinItOffer } from "../../types/just-join-it";
import type { PreparedOfferData } from "../../types/scraper-types";
import { JustJoinItStrategy } from "./just-join-it.strategy";

function createTestOffer(
  overrides: Partial<JustJoinItOffer> = {}
): JustJoinItOffer {
  return {
    guid: "test-guid-123",
    slug: "senior-developer-test-company",
    title: "Senior Developer",
    requiredSkills: [
      { name: "TypeScript", level: 3 },
      { name: "React", level: 3 },
    ],
    niceToHaveSkills: [{ name: "Node.js", level: 2 }],
    workplaceType: "remote",
    workingTime: "full_time",
    experienceLevel: "senior",
    employmentTypes: [
      {
        from: 15_000,
        to: 25_000,
        currency: "pln",
        type: "b2b",
        unit: "month",
        gross: false,
        fromChf: null,
        fromEur: null,
        fromGbp: null,
        fromPln: 15_000,
        fromUsd: null,
        toChf: null,
        toEur: null,
        toGbp: null,
        toPln: 25_000,
        toUsd: null,
      },
    ],
    categoryId: 1,
    multilocation: [
      {
        city: "Warsaw",
        slug: "warsaw",
        street: "Main St",
        latitude: 52.23,
        longitude: 21.01,
      },
    ],
    city: "Warsaw",
    street: "Main St",
    latitude: "52.23",
    longitude: "21.01",
    remoteInterview: true,
    companyName: "Test Company",
    companyLogoThumbUrl: "https://example.com/logo.png",
    publishedAt: "2026-02-06T12:00:00Z",
    lastPublishedAt: "2026-02-06T12:00:00Z",
    expiredAt: "2026-03-06T12:00:00Z",
    openToHireUkrainians: false,
    languages: [{ code: "en", level: "b2" }],
    applyMethod: "redirect",
    isSuperOffer: false,
    promotedPosition: null,
    promotedKeyFilters: [],
    ...overrides,
  };
}

const strategy = new JustJoinItStrategy() as unknown as {
  processOfferForDatabase: (
    offer: JustJoinItOffer,
    scrapingRunId: number
  ) => PreparedOfferData;
};

describe("JustJoinItStrategy", () => {
  describe("offer conversion", () => {
    it("maps all required fields correctly", () => {
      const offer = createTestOffer();
      const result = strategy.processOfferForDatabase(offer, 42);

      expect(result.offer.title).toBe("Senior Developer");
      expect(result.offer.company_name).toBe("Test Company");
      expect(result.offer.offer_url).toBe(
        "https://justjoin.it/offers/senior-developer-test-company"
      );
      expect(result.offer.slug).toBe("senior-developer-test-company");
      expect(result.offer.scraping_run_id).toBe(42);
      expect(result.offer.city).toBe("Warsaw");
      expect(result.offer.street).toBe("Main St");
    });

    it("extracts technologies with correct skill levels", () => {
      const offer = createTestOffer();
      const result = strategy.processOfferForDatabase(offer, 1);

      expect(result.technologies).toEqual([
        { technology_name: "TypeScript", skill_level: "required" },
        { technology_name: "React", skill_level: "required" },
        { technology_name: "Node.js", skill_level: "nice_to_have" },
      ]);
    });

    it("handles null niceToHaveSkills", () => {
      const offer = createTestOffer({ niceToHaveSkills: null });
      const result = strategy.processOfferForDatabase(offer, 1);

      expect(result.technologies).toEqual([
        { technology_name: "TypeScript", skill_level: "required" },
        { technology_name: "React", skill_level: "required" },
      ]);
    });
  });

  describe("enum normalization", () => {
    describe("working_time", () => {
      it.each([
        "full_time",
        "part_time",
        "b2b",
        "internship",
        "freelance",
      ])("accepts valid value: %s", (workingTime) => {
        const offer = createTestOffer({ workingTime });
        const result = strategy.processOfferForDatabase(offer, 1);

        expect(result.offer.working_time).toBe(workingTime);
      });

      it("maps unknown values to null", () => {
        const offer = createTestOffer({ workingTime: "Undetermined" });
        const result = strategy.processOfferForDatabase(offer, 1);

        expect(result.offer.working_time).toBeNull();
      });
    });

    describe("workplace_type", () => {
      it.each([
        "remote",
        "hybrid",
        "office",
      ])("accepts valid value: %s", (workplaceType) => {
        const offer = createTestOffer({ workplaceType });
        const result = strategy.processOfferForDatabase(offer, 1);

        expect(result.offer.workplace_type).toBe(workplaceType);
      });

      it("maps unknown values to null", () => {
        const offer = createTestOffer({ workplaceType: "flexible" });
        const result = strategy.processOfferForDatabase(offer, 1);

        expect(result.offer.workplace_type).toBeNull();
      });
    });

    describe("experience_level", () => {
      it.each([
        ["junior", "junior"],
        ["mid", "mid"],
        ["senior", "senior"],
        ["c_level", "c-level"],
      ])("maps %s to %s", (input, expected) => {
        const offer = createTestOffer({ experienceLevel: input });
        const result = strategy.processOfferForDatabase(offer, 1);

        expect(result.offer.experience_level).toBe(expected);
      });

      it("maps unknown values to null", () => {
        const offer = createTestOffer({ experienceLevel: "lead" });
        const result = strategy.processOfferForDatabase(offer, 1);

        expect(result.offer.experience_level).toBeNull();
      });
    });

    describe("employment_type", () => {
      it.each([
        "permanent",
        "b2b",
        "internship",
        "mandate_contract",
      ])("accepts valid value: %s", (type) => {
        const offer = createTestOffer({
          employmentTypes: [
            {
              from: 10_000,
              to: 20_000,
              currency: "pln",
              type,
              unit: "month",
              gross: false,
              fromChf: null,
              fromEur: null,
              fromGbp: null,
              fromPln: 10_000,
              fromUsd: null,
              toChf: null,
              toEur: null,
              toGbp: null,
              toPln: 20_000,
              toUsd: null,
            },
          ],
        });
        const result = strategy.processOfferForDatabase(offer, 1);

        expect(result.offer.employment_type).toBe(type);
      });

      it("maps 'any' to null", () => {
        const offer = createTestOffer({
          employmentTypes: [
            {
              from: 10_000,
              to: 20_000,
              currency: "pln",
              type: "any",
              unit: "month",
              gross: false,
              fromChf: null,
              fromEur: null,
              fromGbp: null,
              fromPln: 10_000,
              fromUsd: null,
              toChf: null,
              toEur: null,
              toGbp: null,
              toPln: 20_000,
              toUsd: null,
            },
          ],
        });
        const result = strategy.processOfferForDatabase(offer, 1);

        expect(result.offer.employment_type).toBeNull();
      });

      it("maps unknown values to null", () => {
        const offer = createTestOffer({
          employmentTypes: [
            {
              from: 10_000,
              to: 20_000,
              currency: "pln",
              type: "contractor",
              unit: "month",
              gross: false,
              fromChf: null,
              fromEur: null,
              fromGbp: null,
              fromPln: 10_000,
              fromUsd: null,
              toChf: null,
              toEur: null,
              toGbp: null,
              toPln: 20_000,
              toUsd: null,
            },
          ],
        });
        const result = strategy.processOfferForDatabase(offer, 1);

        expect(result.offer.employment_type).toBeNull();
      });
    });
  });

  describe("salary normalization", () => {
    it("extracts salary from first employment type", () => {
      const offer = createTestOffer();
      const result = strategy.processOfferForDatabase(offer, 1);

      expect(result.offer.salary_from).toBe(15_000);
      expect(result.offer.salary_to).toBe(25_000);
      expect(result.offer.salary_currency).toBe("PLN");
      expect(result.offer.salary_period).toBe("month");
    });

    it("returns empty salary when no employment types", () => {
      const offer = createTestOffer({ employmentTypes: [] });
      const result = strategy.processOfferForDatabase(offer, 1);

      expect(result.offer.salary_from).toBeUndefined();
      expect(result.offer.salary_to).toBeUndefined();
      expect(result.offer.salary_currency).toBeUndefined();
      expect(result.offer.salary_period).toBeUndefined();
      expect(result.offer.employment_type).toBeUndefined();
    });

    it("returns empty salary when from and to are both null", () => {
      const offer = createTestOffer({
        employmentTypes: [
          {
            from: null,
            to: null,
            currency: "pln",
            type: "b2b",
            unit: "month",
            gross: false,
            fromChf: null,
            fromEur: null,
            fromGbp: null,
            fromPln: null,
            fromUsd: null,
            toChf: null,
            toEur: null,
            toGbp: null,
            toPln: null,
            toUsd: null,
          },
        ],
      });
      const result = strategy.processOfferForDatabase(offer, 1);

      expect(result.offer.salary_from).toBeUndefined();
      expect(result.offer.salary_to).toBeUndefined();
    });

    it("uppercases currency", () => {
      const offer = createTestOffer();
      const result = strategy.processOfferForDatabase(offer, 1);

      expect(result.offer.salary_currency).toBe("PLN");
    });
  });
});

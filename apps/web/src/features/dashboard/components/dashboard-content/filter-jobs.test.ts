import { describe, expect, it } from "vitest";
import type { UserJobOffer } from "../../types/dashboard";
import { filterJobs } from "./filter-jobs";

function createJob(overrides: Partial<UserJobOffer> = {}): UserJobOffer {
  return {
    id: 1,
    title: "Frontend Developer",
    companyName: "Acme Corp",
    companyLogoUrl: null,
    workplaceType: "remote",
    experienceLevel: "mid",
    city: "Warsaw",
    salaryFrom: 10_000,
    salaryTo: 15_000,
    salaryCurrency: "PLN",
    salaryPeriod: "month",
    technologies: [],
    applicationUrl: null,
    offerUrl: "https://example.com/job/1",
    publishedAt: "2025-01-01T00:00:00Z",
    similarityScore: 0.8,
    status: "saved",
    matchedAt: "2025-01-15T12:00:00Z",
    ...overrides,
  };
}

describe("filterJobs", () => {
  describe("search filtering", () => {
    it("filters by title (case insensitive)", () => {
      const jobs = [
        createJob({ title: "Frontend Developer" }),
        createJob({ title: "Backend Developer" }),
        createJob({ title: "Designer" }),
      ];

      const result = filterJobs(jobs, { search: "frontend", status: "all" });
      expect(result).toHaveLength(1);
      expect(result.map((j) => j.title)).toEqual(["Frontend Developer"]);
    });

    it("filters by company name (case insensitive)", () => {
      const jobs = [
        createJob({ companyName: "Acme Corp" }),
        createJob({ companyName: "Beta Inc" }),
      ];

      const result = filterJobs(jobs, { search: "acme", status: "all" });
      expect(result).toHaveLength(1);
      expect(result.map((j) => j.companyName)).toEqual(["Acme Corp"]);
    });

    it("handles null company name without crashing", () => {
      const jobs = [createJob({ companyName: null, title: "Dev" })];

      const result = filterJobs(jobs, { search: "Dev", status: "all" });
      expect(result).toHaveLength(1);
    });

    it("returns all jobs when search is empty", () => {
      const jobs = [createJob(), createJob()];

      const result = filterJobs(jobs, { search: "", status: "all" });
      expect(result).toHaveLength(2);
    });
  });

  describe("status filtering", () => {
    it("filters by specific status", () => {
      const jobs = [
        createJob({ status: "saved" }),
        createJob({ status: "applied" }),
        createJob({ status: "rejected" }),
      ];

      const result = filterJobs(jobs, { status: "applied" });
      expect(result).toHaveLength(1);
      expect(result.map((j) => j.status)).toEqual(["applied"]);
    });

    it("defaults to 'saved' when status is not provided", () => {
      const jobs = [
        createJob({ status: "saved" }),
        createJob({ status: "applied" }),
      ];

      const result = filterJobs(jobs, {});
      expect(result).toHaveLength(1);
      expect(result.map((j) => j.status)).toEqual(["saved"]);
    });

    it("shows all jobs when status is 'all'", () => {
      const jobs = [
        createJob({ status: "saved" }),
        createJob({ status: "applied" }),
        createJob({ status: "rejected" }),
      ];

      const result = filterJobs(jobs, { status: "all" });
      expect(result).toHaveLength(3);
    });

    it("defaults to 'saved' when status is empty string", () => {
      const jobs = [
        createJob({ status: "saved" }),
        createJob({ status: "applied" }),
      ];

      const result = filterJobs(jobs, { status: "" });
      expect(result).toHaveLength(1);
      expect(result.map((j) => j.status)).toEqual(["saved"]);
    });
  });

  describe("salary range filtering", () => {
    it("filters by salary range with matching currency", () => {
      const jobs = [
        createJob({
          salaryFrom: 8000,
          salaryTo: 12_000,
          salaryCurrency: "PLN",
        }),
        createJob({
          salaryFrom: 20_000,
          salaryTo: 25_000,
          salaryCurrency: "PLN",
        }),
      ];

      const result = filterJobs(jobs, {
        status: "all",
        salaryMin: 7000,
        salaryMax: 15_000,
        currency: "PLN",
      });
      expect(result).toHaveLength(1);
      expect(result.map((j) => j.salaryFrom)).toEqual([8000]);
    });

    it("includes jobs with different currency regardless of range", () => {
      const jobs = [
        createJob({
          salaryFrom: 5000,
          salaryTo: 8000,
          salaryCurrency: "EUR",
        }),
      ];

      const result = filterJobs(jobs, {
        status: "all",
        salaryMin: 15_000,
        salaryMax: 25_000,
        currency: "PLN",
      });
      expect(result).toHaveLength(1);
    });

    it("includes jobs without salary when min is 0", () => {
      const jobs = [
        createJob({
          salaryFrom: null,
          salaryTo: null,
          salaryCurrency: null,
        }),
      ];

      const result = filterJobs(jobs, {
        status: "all",
        salaryMin: 0,
        currency: "PLN",
      });
      expect(result).toHaveLength(1);
    });

    it("excludes jobs without salary when min is above 0", () => {
      const jobs = [
        createJob({
          salaryFrom: null,
          salaryTo: null,
          salaryCurrency: null,
        }),
      ];

      const result = filterJobs(jobs, {
        status: "all",
        salaryMin: 5000,
        currency: "PLN",
      });
      expect(result).toHaveLength(0);
    });

    it("includes jobs above SALARY_MAX when max slider is at SALARY_MAX", () => {
      const jobs = [
        createJob({
          salaryFrom: 48_000,
          salaryTo: 55_000,
          salaryCurrency: "PLN",
        }),
        createJob({
          salaryFrom: 45_000,
          salaryTo: 50_000,
          salaryCurrency: "PLN",
        }),
      ];

      const result = filterJobs(jobs, {
        status: "all",
        salaryMin: 45_000,
        salaryMax: 50_000,
        currency: "PLN",
      });
      expect(result).toHaveLength(2);
    });

    it("handles jobs with only salaryFrom and no salaryTo", () => {
      const jobs = [
        createJob({
          salaryFrom: 10_000,
          salaryTo: null,
          salaryCurrency: "PLN",
        }),
      ];

      const result = filterJobs(jobs, {
        status: "all",
        salaryMin: 8000,
        salaryMax: 12_000,
        currency: "PLN",
      });
      expect(result).toHaveLength(1);
    });
  });

  describe("sort modes", () => {
    it("sorts by match score descending (default)", () => {
      const jobs = [
        createJob({ id: 1, similarityScore: 0.5 }),
        createJob({ id: 2, similarityScore: 0.9 }),
        createJob({ id: 3, similarityScore: 0.7 }),
      ];

      const result = filterJobs(jobs, { status: "all" });
      expect(result.map((j) => j.id)).toEqual([2, 3, 1]);
    });

    it("sorts by match score ascending", () => {
      const jobs = [
        createJob({ id: 1, similarityScore: 0.5 }),
        createJob({ id: 2, similarityScore: 0.9 }),
        createJob({ id: 3, similarityScore: 0.7 }),
      ];

      const result = filterJobs(jobs, { status: "all", sort: "match_asc" });
      expect(result.map((j) => j.id)).toEqual([1, 3, 2]);
    });

    it("sorts by date descending (newest first)", () => {
      const jobs = [
        createJob({ id: 1, matchedAt: "2025-01-01T00:00:00Z" }),
        createJob({ id: 2, matchedAt: "2025-01-15T00:00:00Z" }),
        createJob({ id: 3, matchedAt: "2025-01-10T00:00:00Z" }),
      ];

      const result = filterJobs(jobs, { status: "all", sort: "date_desc" });
      expect(result.map((j) => j.id)).toEqual([2, 3, 1]);
    });

    it("sorts by date ascending (oldest first)", () => {
      const jobs = [
        createJob({ id: 1, matchedAt: "2025-01-15T00:00:00Z" }),
        createJob({ id: 2, matchedAt: "2025-01-01T00:00:00Z" }),
        createJob({ id: 3, matchedAt: "2025-01-10T00:00:00Z" }),
      ];

      const result = filterJobs(jobs, { status: "all", sort: "date_asc" });
      expect(result.map((j) => j.id)).toEqual([2, 3, 1]);
    });

    it("sorts by salary descending (highest first)", () => {
      const jobs = [
        createJob({ id: 1, salaryTo: 10_000 }),
        createJob({ id: 2, salaryTo: 25_000 }),
        createJob({ id: 3, salaryTo: 15_000 }),
      ];

      const result = filterJobs(jobs, { status: "all", sort: "salary_desc" });
      expect(result.map((j) => j.id)).toEqual([2, 3, 1]);
    });

    it("sorts by salary ascending (lowest first)", () => {
      const jobs = [
        createJob({ id: 1, salaryTo: 25_000 }),
        createJob({ id: 2, salaryTo: 10_000 }),
        createJob({ id: 3, salaryTo: 15_000 }),
      ];

      const result = filterJobs(jobs, { status: "all", sort: "salary_asc" });
      expect(result.map((j) => j.id)).toEqual([2, 3, 1]);
    });

    it("handles null similarity scores in match sort", () => {
      const jobs = [
        createJob({ id: 1, similarityScore: null }),
        createJob({ id: 2, similarityScore: 0.8 }),
      ];

      const result = filterJobs(jobs, { status: "all", sort: "match_desc" });
      expect(result.map((j) => j.id)).toEqual([2, 1]);
    });

    it("handles null salary in salary sort", () => {
      const jobs = [
        createJob({
          id: 1,
          salaryFrom: null,
          salaryTo: null,
          salaryCurrency: null,
        }),
        createJob({ id: 2, salaryTo: 15_000 }),
      ];

      const result = filterJobs(jobs, { status: "all", sort: "salary_desc" });
      expect(result.map((j) => j.id)).toEqual([2, 1]);
    });
  });

  describe("show only new filter", () => {
    it("shows only jobs matched after last run", () => {
      const lastRun = "2025-01-10T00:00:00Z";
      const jobs = [
        createJob({ id: 1, matchedAt: "2025-01-05T00:00:00Z" }),
        createJob({ id: 2, matchedAt: "2025-01-15T00:00:00Z" }),
        createJob({ id: 3, matchedAt: "2025-01-10T00:00:00Z" }),
      ];

      const result = filterJobs(jobs, {
        status: "all",
        showOnlyNew: true,
        lastRunCreatedAt: lastRun,
      });
      expect(result).toHaveLength(2);
      expect(result.map((j) => j.id)).toContain(2);
      expect(result.map((j) => j.id)).toContain(3);
    });

    it("skips new filter when lastRunCreatedAt is null", () => {
      const jobs = [createJob()];

      const result = filterJobs(jobs, {
        status: "all",
        showOnlyNew: true,
        lastRunCreatedAt: null,
      });
      expect(result).toHaveLength(1);
    });

    it("ignores showOnlyNew when false", () => {
      const jobs = [
        createJob({ id: 1, matchedAt: "2025-01-05T00:00:00Z" }),
        createJob({ id: 2, matchedAt: "2025-01-15T00:00:00Z" }),
      ];

      const result = filterJobs(jobs, {
        status: "all",
        showOnlyNew: false,
        lastRunCreatedAt: "2025-01-10T00:00:00Z",
      });
      expect(result).toHaveLength(2);
    });
  });

  describe("combined filters", () => {
    it("applies search + status + salary + sort together", () => {
      const jobs = [
        createJob({
          id: 1,
          title: "Frontend Dev",
          status: "saved",
          similarityScore: 0.5,
          salaryFrom: 10_000,
          salaryTo: 15_000,
          salaryCurrency: "PLN",
        }),
        createJob({
          id: 2,
          title: "Frontend Engineer",
          status: "saved",
          similarityScore: 0.9,
          salaryFrom: 20_000,
          salaryTo: 25_000,
          salaryCurrency: "PLN",
        }),
        createJob({
          id: 3,
          title: "Backend Dev",
          status: "saved",
          similarityScore: 0.7,
          salaryFrom: 12_000,
          salaryTo: 18_000,
          salaryCurrency: "PLN",
        }),
        createJob({
          id: 4,
          title: "Frontend Lead",
          status: "applied",
          similarityScore: 0.95,
          salaryFrom: 22_000,
          salaryTo: 30_000,
          salaryCurrency: "PLN",
        }),
      ];

      const result = filterJobs(jobs, {
        search: "frontend",
        status: "saved",
        salaryMin: 16_000,
        salaryMax: 30_000,
        currency: "PLN",
        sort: "match_desc",
      });
      expect(result).toHaveLength(1);
      expect(result.map((j) => j.id)).toEqual([2]);
    });

    it("does not mutate the original array", () => {
      const jobs = [
        createJob({ id: 1, similarityScore: 0.3 }),
        createJob({ id: 2, similarityScore: 0.9 }),
      ];
      const originalOrder = jobs.map((j) => j.id);

      filterJobs(jobs, { status: "all", sort: "match_desc" });
      expect(jobs.map((j) => j.id)).toEqual(originalOrder);
    });
  });
});

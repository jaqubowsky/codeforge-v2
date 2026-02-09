import { describe, expect, it } from "vitest";
import { mapMatchRunInfo, mapUserJobOffer } from "./dashboard";

describe("mapUserJobOffer", () => {
  it("maps all fields from DB format to app format", () => {
    const result = mapUserJobOffer({
      similarity_score: 0.85,
      status: "saved",
      created_at: "2025-01-15T12:00:00Z",
      offers: {
        id: 42,
        title: "Senior Frontend",
        company_name: "Acme",
        company_logo_thumb_url: "https://logo.png",
        workplace_type: "remote",
        experience_level: "senior",
        city: "Warsaw",
        salary_from: 15_000,
        salary_to: 25_000,
        salary_currency: "PLN",
        salary_period: "month",
        application_url: "https://apply.com",
        offer_url: "https://offer.com",
        published_at: "2025-01-10T00:00:00Z",
        offer_technologies: [
          { skill_level: "required", technologies: { name: "React" } },
          { skill_level: "nice_to_have", technologies: { name: "TypeScript" } },
        ],
      },
    });

    expect(result).toEqual({
      id: 42,
      title: "Senior Frontend",
      companyName: "Acme",
      companyLogoUrl: "https://logo.png",
      workplaceType: "remote",
      experienceLevel: "senior",
      city: "Warsaw",
      salaryFrom: 15_000,
      salaryTo: 25_000,
      salaryCurrency: "PLN",
      salaryPeriod: "month",
      technologies: [
        { name: "React", skillLevel: "required" },
        { name: "TypeScript", skillLevel: "nice_to_have" },
      ],
      applicationUrl: "https://apply.com",
      offerUrl: "https://offer.com",
      publishedAt: "2025-01-10T00:00:00Z",
      similarityScore: 0.85,
      status: "saved",
      matchedAt: "2025-01-15T12:00:00Z",
    });
  });

  it("returns null when offers is null", () => {
    const result = mapUserJobOffer({
      similarity_score: null,
      status: "saved",
      created_at: "2025-01-15T12:00:00Z",
      offers: null as never,
    });

    expect(result).toBeNull();
  });

  it("filters out technologies with null names", () => {
    const result = mapUserJobOffer({
      similarity_score: 0.5,
      status: "saved",
      created_at: "2025-01-15T12:00:00Z",
      offers: {
        id: 1,
        title: "Dev",
        company_name: null,
        company_logo_thumb_url: null,
        workplace_type: null,
        experience_level: null,
        city: null,
        salary_from: null,
        salary_to: null,
        salary_currency: null,
        salary_period: null,
        application_url: null,
        offer_url: "https://offer.com",
        published_at: null,
        offer_technologies: [
          { skill_level: "required", technologies: null },
          { skill_level: "required", technologies: { name: "Python" } },
        ],
      },
    });

    expect(result?.technologies).toEqual([
      { name: "Python", skillLevel: "required" },
    ]);
  });

  it("handles empty offer_technologies array", () => {
    const result = mapUserJobOffer({
      similarity_score: 0.5,
      status: "saved",
      created_at: "2025-01-15T12:00:00Z",
      offers: {
        id: 1,
        title: "Dev",
        company_name: null,
        company_logo_thumb_url: null,
        workplace_type: null,
        experience_level: null,
        city: null,
        salary_from: null,
        salary_to: null,
        salary_currency: null,
        salary_period: null,
        application_url: null,
        offer_url: "https://offer.com",
        published_at: null,
        offer_technologies: [],
      },
    });

    expect(result?.technologies).toEqual([]);
  });

  it("maps all null optional fields without crashing", () => {
    const result = mapUserJobOffer({
      similarity_score: null,
      status: "saved",
      created_at: "2025-01-15T12:00:00Z",
      offers: {
        id: 1,
        title: "Dev",
        company_name: null,
        company_logo_thumb_url: null,
        workplace_type: null,
        experience_level: null,
        city: null,
        salary_from: null,
        salary_to: null,
        salary_currency: null,
        salary_period: null,
        application_url: null,
        offer_url: "https://offer.com",
        published_at: null,
        offer_technologies: [],
      },
    });

    expect(result).not.toBeNull();
    expect(result?.companyName).toBeNull();
    expect(result?.similarityScore).toBeNull();
  });
});

describe("mapMatchRunInfo", () => {
  it("maps a valid match run DTO", () => {
    const result = mapMatchRunInfo({
      created_at: "2025-01-15T12:00:00Z",
      new_jobs_count: 10,
      status: "completed",
    });

    expect(result).toEqual({
      lastRunAt: "2025-01-15T12:00:00Z",
      newJobsCount: 10,
      status: "completed",
    });
  });

  it("returns defaults for null DTO", () => {
    const result = mapMatchRunInfo(null);

    expect(result).toEqual({
      lastRunAt: null,
      newJobsCount: 0,
      status: null,
    });
  });

  it("defaults null new_jobs_count to 0", () => {
    const result = mapMatchRunInfo({
      created_at: "2025-01-15T12:00:00Z",
      new_jobs_count: null,
      status: "running",
    });

    expect(result.newJobsCount).toBe(0);
  });

  it("preserves failed status", () => {
    const result = mapMatchRunInfo({
      created_at: "2025-01-15T12:00:00Z",
      new_jobs_count: 0,
      status: "failed",
    });

    expect(result.status).toBe("failed");
  });
});

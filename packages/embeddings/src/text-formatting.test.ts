import { describe, expect, it } from "vitest";
import {
  formatJobDocument,
  formatProfileQuery,
  type JobDocumentData,
  type ProfileQueryData,
} from "./text-formatting";

describe("formatProfileQuery", () => {
  it("formats complete profile data with all fields", () => {
    const data: ProfileQueryData = {
      skills: ["React", "TypeScript"],
      experienceLevels: ["mid", "senior"],
      workLocations: ["remote"],
      idealRoleDescription: "Looking for a frontend role",
    };

    expect(formatProfileQuery(data)).toBe(
      "Skills: React, TypeScript | Experience: mid, senior | Work location: remote | Looking for a frontend role"
    );
  });

  it("omits skills when array is empty", () => {
    const data: ProfileQueryData = {
      skills: [],
      experienceLevels: ["junior"],
      workLocations: ["office"],
      idealRoleDescription: "Entry level developer",
    };

    const result = formatProfileQuery(data);
    expect(result).not.toContain("Skills:");
    expect(result).toBe(
      "Experience: junior | Work location: office | Entry level developer"
    );
  });

  it("omits experience levels when array is empty", () => {
    const data: ProfileQueryData = {
      skills: ["Python"],
      experienceLevels: [],
      workLocations: ["hybrid"],
      idealRoleDescription: "Data engineer",
    };

    const result = formatProfileQuery(data);
    expect(result).not.toContain("Experience:");
    expect(result).toBe(
      "Skills: Python | Work location: hybrid | Data engineer"
    );
  });

  it("omits work locations when array is empty", () => {
    const data: ProfileQueryData = {
      skills: ["Go"],
      experienceLevels: ["senior"],
      workLocations: [],
      idealRoleDescription: "Backend systems",
    };

    const result = formatProfileQuery(data);
    expect(result).not.toContain("Work location:");
    expect(result).toBe("Skills: Go | Experience: senior | Backend systems");
  });

  it("omits ideal role description when empty string", () => {
    const data: ProfileQueryData = {
      skills: ["Java"],
      experienceLevels: ["mid"],
      workLocations: ["office"],
      idealRoleDescription: "",
    };

    const result = formatProfileQuery(data);
    expect(result).toBe(
      "Skills: Java | Experience: mid | Work location: office"
    );
  });

  it("returns empty string when all fields are empty", () => {
    const data: ProfileQueryData = {
      skills: [],
      experienceLevels: [],
      workLocations: [],
      idealRoleDescription: "",
    };

    expect(formatProfileQuery(data)).toBe("");
  });
});

describe("formatJobDocument", () => {
  it("formats complete job data with all fields", () => {
    const data: JobDocumentData = {
      title: "Senior Developer",
      companyName: "Acme Corp",
      experienceLevel: "senior",
      workplaceType: "remote",
      city: "Warsaw",
      technologies: ["React", "Node.js"],
      salaryFrom: 15_000,
      salaryTo: 20_000,
      salaryCurrency: "PLN",
    };

    expect(formatJobDocument(data)).toBe(
      "Senior Developer | Company: Acme Corp | Level: senior | Type: remote | Location: Warsaw | Tech: React, Node.js | Salary: 15000-20000 PLN"
    );
  });

  it("includes only title when all optional fields are empty", () => {
    const data: JobDocumentData = {
      title: "Junior Dev",
      technologies: [],
    };

    expect(formatJobDocument(data)).toBe("Junior Dev");
  });

  it("omits salary when salaryFrom is missing", () => {
    const data: JobDocumentData = {
      title: "Dev",
      technologies: [],
      salaryTo: 20_000,
      salaryCurrency: "PLN",
    };

    expect(formatJobDocument(data)).not.toContain("Salary:");
  });

  it("omits salary when salaryTo is missing", () => {
    const data: JobDocumentData = {
      title: "Dev",
      technologies: [],
      salaryFrom: 10_000,
      salaryCurrency: "PLN",
    };

    expect(formatJobDocument(data)).not.toContain("Salary:");
  });

  it("omits salary when salaryCurrency is missing", () => {
    const data: JobDocumentData = {
      title: "Dev",
      technologies: [],
      salaryFrom: 10_000,
      salaryTo: 20_000,
    };

    expect(formatJobDocument(data)).not.toContain("Salary:");
  });

  it("omits salary when salaryFrom is 0 (falsy)", () => {
    const data: JobDocumentData = {
      title: "Dev",
      technologies: [],
      salaryFrom: 0,
      salaryTo: 5000,
      salaryCurrency: "EUR",
    };

    expect(formatJobDocument(data)).not.toContain("Salary:");
  });

  it("includes salary only when all three salary fields are present", () => {
    const data: JobDocumentData = {
      title: "Dev",
      technologies: [],
      salaryFrom: 5000,
      salaryTo: 8000,
      salaryCurrency: "EUR",
    };

    expect(formatJobDocument(data)).toBe("Dev | Salary: 5000-8000 EUR");
  });

  it("omits null optional fields without blank labels", () => {
    const data: JobDocumentData = {
      title: "Backend Dev",
      companyName: null,
      experienceLevel: null,
      workplaceType: null,
      city: null,
      technologies: ["Python"],
      salaryFrom: null,
      salaryTo: null,
      salaryCurrency: null,
    };

    expect(formatJobDocument(data)).toBe("Backend Dev | Tech: Python");
  });

  it("formats multiple technologies separated by commas", () => {
    const data: JobDocumentData = {
      title: "Fullstack",
      technologies: ["React", "Node.js", "PostgreSQL"],
    };

    expect(formatJobDocument(data)).toBe(
      "Fullstack | Tech: React, Node.js, PostgreSQL"
    );
  });

  it("omits technologies when array is empty", () => {
    const data: JobDocumentData = {
      title: "Manager",
      companyName: "BigCo",
      technologies: [],
    };

    expect(formatJobDocument(data)).toBe("Manager | Company: BigCo");
  });
});

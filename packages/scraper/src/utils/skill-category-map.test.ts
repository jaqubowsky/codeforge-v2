import { describe, expect, it } from "vitest";
import {
  mapSkillsToCategories,
  mapSkillsToNoFluffJobsCategories,
} from "./skill-category-map";

describe("mapSkillsToCategories", () => {
  it("maps known frontend skills to javascript", () => {
    expect(mapSkillsToCategories(["react"])).toEqual(["javascript"]);
    expect(mapSkillsToCategories(["typescript"])).toEqual(["javascript"]);
  });

  it("maps python frameworks to python", () => {
    expect(mapSkillsToCategories(["django"])).toEqual(["python"]);
    expect(mapSkillsToCategories(["flask"])).toEqual(["python"]);
  });

  it("is case insensitive", () => {
    expect(mapSkillsToCategories(["React"])).toEqual(["javascript"]);
    expect(mapSkillsToCategories(["TYPESCRIPT"])).toEqual(["javascript"]);
    expect(mapSkillsToCategories(["Django"])).toEqual(["python"]);
  });

  it("trims whitespace", () => {
    expect(mapSkillsToCategories(["  react  "])).toEqual(["javascript"]);
    expect(mapSkillsToCategories([" python "])).toEqual(["python"]);
  });

  it("deduplicates categories from multiple skills", () => {
    const result = mapSkillsToCategories(["react", "typescript", "vue"]);
    expect(result).toEqual(["javascript"]);
  });

  it("returns multiple categories for diverse skills", () => {
    const result = mapSkillsToCategories(["react", "python", "docker"]);
    expect(result).toContain("javascript");
    expect(result).toContain("python");
    expect(result).toContain("devops");
    expect(result).toHaveLength(3);
  });

  it("returns empty array for unknown skills", () => {
    expect(mapSkillsToCategories(["unknownskill"])).toEqual([]);
    expect(mapSkillsToCategories(["blockchain"])).toEqual([]);
  });

  it("returns empty array for empty input", () => {
    expect(mapSkillsToCategories([])).toEqual([]);
  });

  it("filters out unknown skills and maps known ones", () => {
    const result = mapSkillsToCategories(["react", "unknownskill", "python"]);
    expect(result).toContain("javascript");
    expect(result).toContain("python");
    expect(result).toHaveLength(2);
  });
});

describe("mapSkillsToNoFluffJobsCategories", () => {
  it("maps frontend skills to frontend category", () => {
    expect(mapSkillsToNoFluffJobsCategories(["react"])).toEqual(["frontend"]);
    expect(mapSkillsToNoFluffJobsCategories(["vue"])).toEqual(["frontend"]);
  });

  it("maps backend skills to backend category", () => {
    expect(mapSkillsToNoFluffJobsCategories(["python"])).toEqual(["backend"]);
    expect(mapSkillsToNoFluffJobsCategories(["java"])).toEqual(["backend"]);
  });

  it("maps fullstack frameworks correctly", () => {
    expect(mapSkillsToNoFluffJobsCategories(["nextjs"])).toEqual(["fullstack"]);
    expect(mapSkillsToNoFluffJobsCategories(["next.js"])).toEqual([
      "fullstack",
    ]);
  });

  it("is case insensitive", () => {
    expect(mapSkillsToNoFluffJobsCategories(["React"])).toEqual(["frontend"]);
    expect(mapSkillsToNoFluffJobsCategories(["PYTHON"])).toEqual(["backend"]);
  });

  it("trims whitespace", () => {
    expect(mapSkillsToNoFluffJobsCategories(["  react  "])).toEqual([
      "frontend",
    ]);
  });

  it("deduplicates categories", () => {
    const result = mapSkillsToNoFluffJobsCategories([
      "react",
      "typescript",
      "angular",
    ]);
    expect(result).toEqual(["frontend"]);
  });

  it("returns empty array for unknown skills", () => {
    expect(mapSkillsToNoFluffJobsCategories(["unknownskill"])).toEqual([]);
  });

  it("returns empty array for empty input", () => {
    expect(mapSkillsToNoFluffJobsCategories([])).toEqual([]);
  });

  it("returns multiple categories for diverse skills", () => {
    const result = mapSkillsToNoFluffJobsCategories([
      "react",
      "python",
      "docker",
    ]);
    expect(result).toContain("frontend");
    expect(result).toContain("backend");
    expect(result).toContain("devops");
    expect(result).toHaveLength(3);
  });
});

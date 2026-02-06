import { describe, expect, it } from "vitest";
import { onboardingSchema } from "./onboarding";

function validData() {
  return {
    skills: ["React", "TypeScript", "Node.js", "Python"],
    experienceLevel: ["mid"] as const,
    preferredLocations: ["remote"] as const,
    idealRoleDescription:
      "I am looking for a challenging frontend development role with modern technologies",
  };
}

describe("onboardingSchema", () => {
  it("accepts valid complete data", () => {
    const result = onboardingSchema.safeParse(validData());
    expect(result.success).toBe(true);
  });

  it("rejects fewer than 3 skills", () => {
    const data = { ...validData(), skills: ["React", "TypeScript"] };
    const result = onboardingSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("accepts exactly 3 skills", () => {
    const data = { ...validData(), skills: ["React", "TypeScript", "Node.js"] };
    const result = onboardingSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("rejects empty experience level", () => {
    const data = { ...validData(), experienceLevel: [] };
    const result = onboardingSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects empty preferred locations", () => {
    const data = { ...validData(), preferredLocations: [] };
    const result = onboardingSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects description shorter than 50 characters", () => {
    const data = { ...validData(), idealRoleDescription: "Too short" };
    const result = onboardingSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("accepts description of exactly 50 characters", () => {
    const data = {
      ...validData(),
      idealRoleDescription: "a".repeat(50),
    };
    const result = onboardingSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("rejects invalid experience level values", () => {
    const data = { ...validData(), experienceLevel: ["invalid"] };
    const result = onboardingSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects invalid location values", () => {
    const data = { ...validData(), preferredLocations: ["invalid"] };
    const result = onboardingSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("accepts all valid experience levels", () => {
    const data = {
      ...validData(),
      experienceLevel: ["junior", "mid", "senior", "c-level"] as const,
    };
    const result = onboardingSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("accepts all valid location types", () => {
    const data = {
      ...validData(),
      preferredLocations: ["remote", "hybrid", "office"] as const,
    };
    const result = onboardingSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

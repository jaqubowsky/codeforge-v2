import { describe, expect, it } from "vitest";
import { mapProfile } from "./profile";

describe("mapProfile", () => {
  it("maps all fields correctly", () => {
    const result = mapProfile({
      skills: ["React", "TypeScript"],
      experience_level: ["mid", "senior"],
      preferred_locations: ["remote", "hybrid"],
      ideal_role_description: "Looking for a frontend role",
    });

    expect(result).toEqual({
      skills: ["React", "TypeScript"],
      experienceLevel: ["mid", "senior"],
      preferredLocations: ["remote", "hybrid"],
      idealRoleDescription: "Looking for a frontend role",
    });
  });

  it("defaults null arrays to empty arrays", () => {
    const result = mapProfile({
      skills: null,
      experience_level: null,
      preferred_locations: null,
      ideal_role_description: null,
    });

    expect(result).toEqual({
      skills: [],
      experienceLevel: [],
      preferredLocations: [],
      idealRoleDescription: "",
    });
  });

  it("preserves existing values when not null", () => {
    const result = mapProfile({
      skills: [],
      experience_level: [],
      preferred_locations: [],
      ideal_role_description: "",
    });

    expect(result.skills).toEqual([]);
    expect(result.experienceLevel).toEqual([]);
    expect(result.preferredLocations).toEqual([]);
    expect(result.idealRoleDescription).toBe("");
  });
});

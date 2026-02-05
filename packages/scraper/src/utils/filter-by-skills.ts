import type { PreparedOfferData } from "../types/scraper-types";

/**
 * Normalizes a skill name for case-insensitive comparison
 */
function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim();
}

/**
 * Creates a Set of normalized skill names for fast lookup
 */
function createSkillSet(skills: string[]): Set<string> {
  return new Set(skills.map(normalizeSkill));
}

/**
 * Counts matching skills between user skills and offer technologies
 */
function countSkillMatches(
  userSkills: string[],
  offerTechnologies: string[]
): number {
  const userSkillSet = createSkillSet(userSkills);
  const normalizedOfferTechs = offerTechnologies.map(normalizeSkill);

  let count = 0;
  for (const tech of normalizedOfferTechs) {
    if (userSkillSet.has(tech)) {
      count++;
    }
  }
  return count;
}

/**
 * Calculates match score as percentage of user skills matched
 */
/**
 * Filters prepared offer data by user skills
 * Returns only offers that have at least minMatchCount matching technologies
 */
export function filterBySkills(
  preparedData: PreparedOfferData[],
  userSkills: string[],
  minMatchCount = 1
): PreparedOfferData[] {
  if (userSkills.length === 0) {
    return preparedData;
  }

  return preparedData.filter((data) => {
    const offerTechnologies = data.technologies.map((t) => t.technology_name);
    const matchCount = countSkillMatches(userSkills, offerTechnologies);
    return matchCount >= minMatchCount;
  });
}

import type { Technology, UserJobOffer } from "../../types";

interface OfferDTO {
  id: number;
  title: string;
  company_name: string | null;
  company_logo_thumb_url: string | null;
  workplace_type: string | null;
  experience_level: string | null;
  city: string | null;
  salary_from: unknown;
  salary_to: unknown;
  salary_currency: string | null;
  salary_period: string | null;
  application_url: string | null;
  offer_url: string;
  published_at: string | null;
  offer_technologies: Array<{
    skill_level: string;
    technologies: { name: string } | null;
  }>;
}

interface UserOfferDTO {
  similarity_score: number | null;
  status: string;
  created_at: string;
  offers: OfferDTO;
}

function mapTechnology(offerTech: {
  skill_level: string;
  technologies: { name: string } | null;
}): Technology | null {
  if (!offerTech.technologies?.name) {
    return null;
  }

  return {
    name: offerTech.technologies.name,
    skillLevel: offerTech.skill_level,
  };
}

export function mapUserJobOffer(userOffer: UserOfferDTO): UserJobOffer | null {
  const offer = userOffer.offers;
  if (!offer) {
    return null;
  }

  const technologies = (offer.offer_technologies || [])
    .map(mapTechnology)
    .filter((t): t is Technology => t !== null);

  return {
    id: offer.id,
    title: offer.title,
    companyName: offer.company_name,
    companyLogoUrl: offer.company_logo_thumb_url,
    workplaceType: offer.workplace_type,
    experienceLevel: offer.experience_level,
    city: offer.city,
    salaryFrom:
      typeof offer.salary_from === "number" ? offer.salary_from : null,
    salaryTo: typeof offer.salary_to === "number" ? offer.salary_to : null,
    salaryCurrency: offer.salary_currency,
    salaryPeriod: offer.salary_period,
    technologies,
    applicationUrl: offer.application_url,
    offerUrl: offer.offer_url,
    publishedAt: offer.published_at,
    similarityScore: userOffer.similarity_score,
    status: userOffer.status as
      | "saved"
      | "applied"
      | "interviewing"
      | "rejected"
      | "offer_received",
    matchedAt: userOffer.created_at,
  };
}

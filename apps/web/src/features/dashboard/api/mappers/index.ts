import type { Database } from "@codeforge-v2/database";
import type { MatchRunInfo, Technology, UserJobOffer } from "../../types";

type MatchRunRow = Database["public"]["Tables"]["match_runs"]["Row"];
type UserOfferRow = Database["public"]["Tables"]["user_offers"]["Row"];
type OfferRow = Database["public"]["Tables"]["offers"]["Row"];

type OfferDTO = Pick<
  OfferRow,
  | "id"
  | "title"
  | "company_name"
  | "company_logo_thumb_url"
  | "workplace_type"
  | "experience_level"
  | "city"
  | "salary_from"
  | "salary_to"
  | "salary_currency"
  | "salary_period"
  | "application_url"
  | "offer_url"
  | "published_at"
> & {
  offer_technologies: Array<{
    skill_level: string;
    technologies: { name: string } | null;
  }>;
};

type UserOfferDTO = Pick<
  UserOfferRow,
  "similarity_score" | "status" | "created_at"
> & {
  offers: OfferDTO;
};

type MatchRunDTO = Pick<
  MatchRunRow,
  "created_at" | "jobs_found" | "new_jobs_count" | "status"
>;

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
    salaryFrom: offer.salary_from,
    salaryTo: offer.salary_to,
    salaryCurrency: offer.salary_currency,
    salaryPeriod: offer.salary_period,
    technologies,
    applicationUrl: offer.application_url,
    offerUrl: offer.offer_url,
    publishedAt: offer.published_at,
    similarityScore: userOffer.similarity_score,
    status: userOffer.status as UserJobOffer["status"],
    matchedAt: userOffer.created_at,
  };
}

export function mapMatchRunInfo(dto: MatchRunDTO | null): MatchRunInfo {
  if (!dto) {
    return {
      lastRunAt: null,
      jobsFound: 0,
      newJobsCount: 0,
      status: null,
    };
  }

  return {
    lastRunAt: dto.created_at,
    jobsFound: dto.jobs_found ?? 0,
    newJobsCount: dto.new_jobs_count ?? 0,
    status: dto.status,
  };
}

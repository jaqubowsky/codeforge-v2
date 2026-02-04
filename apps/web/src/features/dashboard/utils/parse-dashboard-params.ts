import type { Currency, UserOfferStatus } from "../types";

interface DashboardSearchParams {
  search?: string;
  status?: string;
  sort?: string;
  new?: string;
  salaryMin?: string;
  salaryMax?: string;
  currency?: string;
}

interface ParsedDashboardFilters {
  limit: number;
  offset: number;
  status?: UserOfferStatus;
  search?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: Currency;
}

export function parseDashboardParams(
  params: DashboardSearchParams
): ParsedDashboardFilters {
  return {
    limit: 20,
    offset: 0,
    status:
      params.status && params.status !== "all"
        ? (params.status as UserOfferStatus)
        : undefined,
    search: params.search,
    salaryMin: params.salaryMin ? Number(params.salaryMin) : undefined,
    salaryMax: params.salaryMax ? Number(params.salaryMax) : undefined,
    currency: params.currency as Currency,
  };
}

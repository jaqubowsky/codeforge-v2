import type { Currency, SortOption, UserOfferStatus } from "../types";

export const STATUS_OPTIONS: Array<{
  value: UserOfferStatus;
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
}> = [
  { value: "saved", label: "Inbox", variant: "secondary" },
  { value: "applied", label: "Applied", variant: "default" },
  { value: "interviewing", label: "Interviewing", variant: "outline" },
  { value: "rejected", label: "Rejected", variant: "destructive" },
  { value: "offer_received", label: "Offer", variant: "default" },
];

export const SORT_OPTIONS: Array<{
  value: SortOption;
  label: string;
}> = [
  { value: "match_desc", label: "Best Match" },
  { value: "match_asc", label: "Lowest Match" },
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
];

export const CURRENCY_OPTIONS: Currency[] = ["PLN", "EUR", "USD", "GBP"];

export const SALARY_MIN = 0;
export const SALARY_MAX = 50_000;
export const SALARY_STEP = 500;
export const DEFAULT_CURRENCY: Currency = "PLN";

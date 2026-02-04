import type { UserOfferStatus } from "../types";

export const STATUS_OPTIONS: Array<{
  value: UserOfferStatus;
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
}> = [
  { value: "saved", label: "Saved", variant: "secondary" },
  { value: "applied", label: "Applied", variant: "default" },
  { value: "interviewing", label: "Interviewing", variant: "outline" },
  { value: "rejected", label: "Rejected", variant: "destructive" },
  { value: "offer_received", label: "Offer", variant: "default" },
];

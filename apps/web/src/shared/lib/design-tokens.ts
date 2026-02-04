/**
 * Design tokens for UI components
 * Centralized color and style mappings for consistent theming
 */

export const SECTION_COLORS = {
  blue: {
    border: "border-l-blue-500",
    gradient: "from-blue-50/50 dark:from-blue-950/20",
    iconBg: "bg-blue-600 dark:bg-blue-500",
    iconText: "text-white",
  },
  emerald: {
    border: "border-l-emerald-500",
    gradient: "from-emerald-50/50 dark:from-emerald-950/20",
    iconBg: "bg-emerald-600 dark:bg-emerald-500",
    iconText: "text-white",
  },
  violet: {
    border: "border-l-violet-500",
    gradient: "from-violet-50/50 dark:from-violet-950/20",
    iconBg: "bg-violet-600 dark:bg-violet-500",
    iconText: "text-white",
  },
  amber: {
    border: "border-l-amber-500",
    gradient: "from-amber-50/50 dark:from-amber-950/20",
    iconBg: "bg-amber-600 dark:bg-amber-500",
    iconText: "text-white",
  },
  rose: {
    border: "border-l-rose-500",
    gradient: "from-rose-50/50 dark:from-rose-950/20",
    iconBg: "bg-rose-600 dark:bg-rose-500",
    iconText: "text-white",
  },
} as const;

export const MATCH_SCORE_COLORS = {
  excellent: "bg-green-500", // 80%+
  good: "bg-blue-500", // 60%+
  fair: "bg-yellow-500", // 40%+
  poor: "bg-orange-500", // <40%
} as const;

export type SectionColor = keyof typeof SECTION_COLORS;
export type MatchScoreLevel = keyof typeof MATCH_SCORE_COLORS;

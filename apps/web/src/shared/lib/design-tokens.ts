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

export const FORM_COLORS = {
  label: "text-foreground",
  description: "text-muted-foreground",
  error: "text-destructive",
  required: "text-destructive",
  input: {
    border: "border-input",
    focus: "focus-visible:ring-ring",
  },
  checkbox: {
    checked:
      "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
  },
  selectable: {
    default: "border-border hover:border-border/80 bg-background",
    selected: "border-primary bg-primary/5 dark:bg-primary/10",
  },
} as const;

export const WIZARD_COLORS = {
  step: {
    completed: "bg-emerald-500 text-white shadow-sm",
    current:
      "bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20",
    upcoming: "bg-muted text-muted-foreground",
  },
  connector: {
    completed: "bg-emerald-500",
    upcoming: "bg-border",
  },
  label: {
    completed: "text-emerald-600 dark:text-emerald-400",
    current: "font-medium text-foreground",
    upcoming: "text-muted-foreground",
  },
  navigation: {
    border: "border-border",
    complete: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
} as const;

export const MATCH_SCORE_COLORS = {
  excellent: "bg-green-500",
  good: "bg-blue-500",
  fair: "bg-yellow-500",
  poor: "bg-orange-500",
} as const;

export const AI_COLORS = {
  icon: "text-primary",
  badge: "bg-primary text-primary-foreground hover:bg-primary/90",
  gradient: "bg-gradient-to-r from-primary to-primary/80",
  button: "bg-primary hover:bg-primary/90",
} as const;

export const SURFACE_COLORS = {
  subtle: "bg-muted/50 dark:bg-muted/20",
  card: "bg-card",
} as const;

export type SectionColor = keyof typeof SECTION_COLORS;
export type MatchScoreLevel = keyof typeof MATCH_SCORE_COLORS;

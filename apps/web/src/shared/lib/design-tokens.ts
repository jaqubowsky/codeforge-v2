export const SECTION_COLORS = {
  blue: {
    border: "border-l-primary",
    gradient: "from-primary/5 to-transparent",
    iconBg: "bg-primary",
    iconText: "text-primary-foreground",
  },
  emerald: {
    border: "border-l-success",
    gradient: "from-success/5 to-transparent",
    iconBg: "bg-success",
    iconText: "text-success-foreground",
  },
  violet: {
    border: "border-l-accent",
    gradient: "from-accent/10 to-transparent",
    iconBg: "bg-accent",
    iconText: "text-accent-foreground",
  },
  amber: {
    border: "border-l-warning",
    gradient: "from-warning/5 to-transparent",
    iconBg: "bg-warning",
    iconText: "text-warning-foreground",
  },
  rose: {
    border: "border-l-destructive",
    gradient: "from-destructive/5 to-transparent",
    iconBg: "bg-destructive",
    iconText: "text-destructive-foreground",
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
    selected: "border-primary bg-primary/5",
  },
} as const;

export const WIZARD_COLORS = {
  step: {
    completed: "bg-success text-success-foreground shadow-sm",
    current:
      "bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20",
    upcoming: "bg-muted text-muted-foreground",
  },
  connector: {
    completed: "bg-success",
    upcoming: "bg-border",
  },
  label: {
    completed: "text-success",
    current: "font-medium text-foreground",
    upcoming: "text-muted-foreground",
  },
  navigation: {
    border: "border-border",
    complete: "bg-success hover:bg-success/90 text-success-foreground",
  },
} as const;

export const MATCH_SCORE_COLORS = {
  excellent: "bg-success",
  good: "bg-info",
  fair: "bg-warning",
  poor: "bg-destructive/70",
} as const;

export const STATUS_INTENT = {
  saved: {
    bg: "bg-info/10",
    text: "text-info",
    border: "border-info/30",
    solid: "bg-info text-info-foreground",
  },
  applied: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/30",
    solid: "bg-success text-success-foreground",
  },
  interviewing: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/30",
    solid: "bg-primary text-primary-foreground",
  },
  rejected: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/30",
    solid: "bg-destructive text-destructive-foreground",
  },
  offer_received: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/30",
    solid: "bg-warning text-warning-foreground",
  },
  deleted: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    solid: "bg-muted text-muted-foreground",
  },
} as const;

export const FILTER_BUTTON_STYLES = {
  base: [
    "inline-flex items-center justify-center gap-1.5",
    "rounded-full border px-4 py-2",
    "font-medium text-sm transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ].join(" "),
  inactive:
    "bg-transparent border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
  activeDefault: "bg-foreground text-background border-foreground shadow-md",
} as const;

export type SectionColor = keyof typeof SECTION_COLORS;
export type MatchScoreLevel = keyof typeof MATCH_SCORE_COLORS;

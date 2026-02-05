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

export type SectionColor = keyof typeof SECTION_COLORS;

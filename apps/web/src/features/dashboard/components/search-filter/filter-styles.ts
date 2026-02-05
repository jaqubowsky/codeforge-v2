export const FILTER_BUTTON_STYLES = {
  base: [
    "inline-flex items-center justify-center gap-1.5",
    "rounded-sm border px-4 py-2",
    "font-mono text-sm transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ].join(" "),
  inactive:
    "bg-transparent border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
  activeDefault: "bg-foreground text-background border-foreground shadow-md",
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

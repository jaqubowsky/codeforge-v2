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

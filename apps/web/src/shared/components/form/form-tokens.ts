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

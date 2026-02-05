"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { FORM_COLORS } from "@/shared/lib/design-tokens";

interface FormDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function FormDescription({ children, className }: FormDescriptionProps) {
  return (
    <p className={cn("text-xs", FORM_COLORS.description, className)}>
      {children}
    </p>
  );
}

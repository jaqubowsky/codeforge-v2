"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { FORM_COLORS } from "./form-tokens";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p className={cn("text-sm", FORM_COLORS.error, className)}>{message}</p>
  );
}

"use client";

import { Label } from "@codeforge-v2/ui/components/label";
import { cn } from "@codeforge-v2/ui/lib/utils";
import type { ComponentProps } from "react";
import { FORM_COLORS } from "./form-tokens";

interface FormLabelProps extends ComponentProps<typeof Label> {
  required?: boolean;
}

export function FormLabel({
  children,
  className,
  required,
  ...props
}: FormLabelProps) {
  return (
    <Label className={cn(FORM_COLORS.label, className)} {...props}>
      {children}
      {required && <span className={FORM_COLORS.required}> *</span>}
    </Label>
  );
}

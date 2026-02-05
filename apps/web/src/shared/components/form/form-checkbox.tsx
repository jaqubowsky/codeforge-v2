"use client";

import { Checkbox } from "@codeforge-v2/ui/components/checkbox";
import { cn } from "@codeforge-v2/ui/lib/utils";
import type { ComponentProps } from "react";
import { FORM_COLORS } from "@/shared/lib/design-tokens";

type FormCheckboxProps = ComponentProps<typeof Checkbox>;

export function FormCheckbox({ className, ...props }: FormCheckboxProps) {
  return (
    <Checkbox
      className={cn(FORM_COLORS.checkbox.checked, className)}
      {...props}
    />
  );
}

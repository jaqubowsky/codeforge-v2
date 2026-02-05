"use client";

import { Input } from "@codeforge-v2/ui/components/input";
import { cn } from "@codeforge-v2/ui/lib/utils";
import type { ComponentProps } from "react";
import { FORM_COLORS } from "@/shared/lib/design-tokens";

type FormInputProps = ComponentProps<typeof Input>;

export function FormInput({ className, ...props }: FormInputProps) {
  return (
    <Input
      className={cn(
        FORM_COLORS.input.border,
        FORM_COLORS.input.focus,
        className
      )}
      {...props}
    />
  );
}

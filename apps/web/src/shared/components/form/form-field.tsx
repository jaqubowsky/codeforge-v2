"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
  trailing?: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  children,
  className,
  trailing,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label
          className="font-medium text-foreground text-sm"
          htmlFor={htmlFor}
        >
          {label}
        </label>
        {trailing}
      </div>
      {children}
    </div>
  );
}

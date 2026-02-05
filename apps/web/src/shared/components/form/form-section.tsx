"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { FORM_COLORS } from "@/shared/lib/design-tokens";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <h3 className={cn("font-semibold text-lg", FORM_COLORS.label)}>
          {title}
        </h3>
        {description && (
          <p className={cn("text-sm", FORM_COLORS.description)}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

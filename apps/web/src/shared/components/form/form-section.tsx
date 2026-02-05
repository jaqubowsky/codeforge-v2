"use client";

import { Heading } from "@codeforge-v2/ui/components/heading";
import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";

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
        <Heading level={3}>{title}</Heading>
        {description && <Text variant="caption">{description}</Text>}
      </div>
      {children}
    </div>
  );
}

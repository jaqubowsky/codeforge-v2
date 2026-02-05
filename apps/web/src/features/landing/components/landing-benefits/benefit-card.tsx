"use client";

import { Heading } from "@codeforge-v2/ui/components/heading";
import { Separator } from "@codeforge-v2/ui/components/separator";
import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { SECTION_COLORS } from "@/shared/lib/design-tokens";

interface BenefitCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: keyof typeof SECTION_COLORS;
  delay: number;
  index: number;
}

export function BenefitCard({
  icon: Icon,
  title,
  description,
  color,
  delay,
  index,
}: BenefitCardProps) {
  const { ref, isVisible } = useScrollReveal();
  const colorStyles = SECTION_COLORS[color];

  return (
    <div
      className={cn(
        "group relative bg-card p-8 transition-all duration-700 lg:p-10",
        "hover:bg-muted/20",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="absolute top-6 right-6 font-bold font-mono text-4xl text-muted-foreground/10 lg:top-8 lg:right-8 lg:text-5xl">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div
        className={cn(
          "mb-6 flex h-10 w-10 items-center justify-center rounded-md",
          colorStyles.iconBg,
          colorStyles.iconText
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <Heading className="mb-3" level={4}>
        {title}
      </Heading>
      <Text variant="caption">{description}</Text>

      <Separator className="mt-6 group-hover:bg-primary" variant="decorative" />
    </div>
  );
}

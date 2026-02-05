"use client";

import { Heading } from "@codeforge-v2/ui/components/heading";
import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { SECTION_COLORS } from "@/shared/lib/design-tokens";

interface StepCardProps {
  step: number;
  icon: React.ElementType;
  title: string;
  description: string;
  color: keyof typeof SECTION_COLORS;
  delay: number;
}

export function StepCard({
  step,
  icon: Icon,
  title,
  description,
  color,
  delay,
}: StepCardProps) {
  const { ref, isVisible } = useScrollReveal();
  const colorStyles = SECTION_COLORS[color];

  return (
    <div
      className={cn(
        "group relative transition-all duration-700",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative h-full overflow-hidden rounded-lg border border-border/50 bg-card p-8 transition-colors duration-300 hover:border-border lg:p-10">
        <span className="absolute -top-6 -right-2 font-bold font-display text-[120px] text-muted-foreground/[0.04] leading-none lg:text-[140px]">
          {step}
        </span>

        <div className="relative">
          <div
            className={cn(
              "mb-8 flex h-12 w-12 items-center justify-center rounded-lg",
              colorStyles.iconBg,
              colorStyles.iconText,
              "transition-transform duration-300 group-hover:scale-105"
            )}
          >
            <Icon className="h-6 w-6" />
          </div>

          <div className="mb-3 flex items-center gap-3">
            <Text as="span" muted variant="mono">
              Step {String(step).padStart(2, "0")}
            </Text>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Heading level={3}>{title}</Heading>
          <Text className="mt-3" variant="caption">
            {description}
          </Text>
        </div>
      </div>
    </div>
  );
}

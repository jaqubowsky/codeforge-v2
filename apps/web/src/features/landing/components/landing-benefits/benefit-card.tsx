"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { GlassCard } from "@/shared/components/ui/glass-card";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { SECTION_COLORS } from "@/shared/lib/design-tokens";

interface BenefitCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: keyof typeof SECTION_COLORS;
  delay: number;
}

export function BenefitCard({
  icon: Icon,
  title,
  description,
  color,
  delay,
}: BenefitCardProps) {
  const { ref, isVisible } = useScrollReveal();
  const colorStyles = SECTION_COLORS[color];

  return (
    <div
      className={cn(
        "transition-all duration-700",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <GlassCard className="h-full p-6" hoverable>
        <div
          className={cn(
            "mb-4 flex h-12 w-12 items-center justify-center rounded-xl",
            colorStyles.iconBg,
            colorStyles.iconText
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </GlassCard>
    </div>
  );
}

"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { GlassCard } from "@/shared/components/ui/glass-card";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { SECTION_COLORS } from "@/shared/lib/design-tokens";

function getShadowColor(color: keyof typeof SECTION_COLORS) {
  if (color === "blue") {
    return "primary";
  }
  if (color === "emerald") {
    return "success";
  }
  return "accent";
}

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
        "transition-all duration-700",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex gap-6 lg:gap-8">
        <div className="relative z-10 flex-shrink-0">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl",
              "border-2",
              colorStyles.iconBg,
              colorStyles.iconText,
              "shadow-lg"
            )}
            style={{
              boxShadow: `0 8px 32px -8px var(--${getShadowColor(color)})`,
            }}
          >
            <Icon className="h-7 w-7" />
          </div>
        </div>

        <GlassCard className="flex-1 p-6" hoverable>
          <div className="mb-2 flex items-center gap-3">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full font-semibold text-xs",
                colorStyles.iconBg,
                colorStyles.iconText
              )}
            >
              {step}
            </span>
            <h3 className="font-semibold text-xl">{title}</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </GlassCard>
      </div>
    </div>
  );
}

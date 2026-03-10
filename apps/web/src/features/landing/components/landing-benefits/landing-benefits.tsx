"use client";

import { Heading } from "@codeforge-v2/ui/components/heading";
import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { BENEFITS } from "../../constants/content";
import { BenefitCard } from "./benefit-card";

export function LandingBenefits() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-28" id="benefits">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_0%_50%,var(--primary)/0.03,transparent)]" />

      <div className="container relative px-6">
        <div
          className={cn(
            "mx-auto mb-20 max-w-xl text-center lg:mx-0 lg:text-left",
            "transition-all duration-700",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          ref={ref}
        >
          <Text as="span" className="mb-4 block" muted variant="mono">
            Why jobZ
          </Text>
          <Heading level={2}>
            Engineered for
            <br />
            <span className="text-muted-foreground">your job search</span>
          </Heading>
        </div>

        <div className="grid gap-px overflow-hidden rounded-lg border border-border/50 bg-border/50 sm:grid-cols-2">
          {BENEFITS.map((benefit, index) => (
            <BenefitCard
              color={benefit.color}
              delay={index * 100}
              description={benefit.description}
              icon={benefit.icon}
              index={index}
              key={benefit.title}
              title={benefit.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

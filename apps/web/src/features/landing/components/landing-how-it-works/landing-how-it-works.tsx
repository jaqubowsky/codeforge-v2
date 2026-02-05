"use client";

import { Heading } from "@codeforge-v2/ui/components/heading";
import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { HOW_IT_WORKS } from "../../constants/content";
import { StepCard } from "./step-card";

export function LandingHowItWorks() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-28" id="how-it-works">
      <div className="absolute inset-0 bg-muted/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_20%,var(--primary)/0.04,transparent)]" />

      <div className="container relative px-6">
        <div
          className={cn(
            "mb-20 flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between",
            "transition-all duration-700",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          ref={ref}
        >
          <div className="max-w-xl text-center lg:text-left">
            <Text as="span" className="mb-4 block" muted variant="mono">
              Process
            </Text>
            <Heading level={2}>
              Three steps to
              <br />
              <span className="text-muted-foreground">your next role</span>
            </Heading>
          </div>
          <Text
            className="max-w-sm text-center lg:text-right"
            variant="caption"
          >
            A streamlined pipeline from profile to placement. No noise, no
            wasted time.
          </Text>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {HOW_IT_WORKS.map((step, index) => (
            <StepCard
              color={step.color}
              delay={index * 150}
              description={step.description}
              icon={step.icon}
              key={step.step}
              step={step.step}
              title={step.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

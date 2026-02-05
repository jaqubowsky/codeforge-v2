"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { HOW_IT_WORKS } from "../../constants/content";
import { StepCard } from "./step-card";

export function LandingHowItWorks() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-24" id="how-it-works">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,var(--primary)/0.05,transparent)]" />

      <div className="container relative px-6">
        <div
          className={cn(
            "mx-auto mb-16 max-w-2xl text-center",
            "transition-all duration-700",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          ref={ref}
        >
          <h2 className="font-bold font-display text-3xl tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps to transform your job search
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <div className="absolute top-16 left-8 hidden h-[calc(100%-8rem)] w-px bg-gradient-to-b from-primary/50 via-success/50 to-accent/50 lg:block" />

            <div className="space-y-8 lg:space-y-12">
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
        </div>
      </div>
    </section>
  );
}

"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { BENEFITS } from "../../constants/content";
import { BenefitCard } from "./benefit-card";

export function LandingBenefits() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-24" id="benefits">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_0%_50%,var(--primary)/0.03,transparent)]" />

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
            Why Choose LandIT?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Stop wasting time on job boards. Let AI do the heavy lifting.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => (
            <BenefitCard
              color={benefit.color}
              delay={index * 100}
              description={benefit.description}
              icon={benefit.icon}
              key={benefit.title}
              title={benefit.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

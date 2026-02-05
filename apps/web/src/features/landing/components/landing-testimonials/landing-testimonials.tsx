"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { TESTIMONIALS } from "../../constants/content";
import { TestimonialCard } from "./testimonial-card";

export function LandingTestimonials() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-24" id="testimonials">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_100%_50%,var(--primary)/0.03,transparent)]" />

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
            What Developers Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join hundreds of developers who transformed their job search
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              avatar={testimonial.avatar}
              company={testimonial.company}
              delay={index * 100}
              key={testimonial.name}
              name={testimonial.name}
              quote={testimonial.quote}
              role={testimonial.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Heading } from "@codeforge-v2/ui/components/heading";
import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { TESTIMONIALS } from "../../constants/content";
import { TestimonialCard } from "./testimonial-card";

export function LandingTestimonials() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-28" id="testimonials">
      <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_50%,var(--primary)/0.03,transparent)]" />

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
            Testimonials
          </Text>
          <Heading level={2}>
            Trusted by
            <br />
            <span className="text-muted-foreground">developers like you</span>
          </Heading>
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

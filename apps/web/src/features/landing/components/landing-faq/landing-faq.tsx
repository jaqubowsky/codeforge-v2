"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { FAQ_ITEMS } from "../../constants/content";
import { useFaqAccordion } from "../../hooks/use-faq-accordion";
import { FaqItem } from "./faq-item";

export function LandingFaq() {
  const { ref, isVisible } = useScrollReveal();
  const { toggle, isOpen } = useFaqAccordion();

  return (
    <section className="relative py-24" id="faq">
      <div className="absolute inset-0 bg-muted/30" />

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
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about LandIT
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <FaqItem
              answer={item.answer}
              index={index}
              isOpen={isOpen(index)}
              key={item.question}
              onToggle={toggle}
              question={item.question}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Heading } from "@codeforge-v2/ui/components/heading";
import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { FAQ_ITEMS } from "../../constants/content";
import { FaqItem } from "./faq-item";
import { useFaqAccordion } from "./use-faq-accordion";

export function LandingFaq() {
  const { ref, isVisible } = useScrollReveal();
  const { toggle, isOpen } = useFaqAccordion();

  return (
    <section className="relative py-28" id="faq">
      <div className="absolute inset-0 bg-muted/20" />

      <div className="container relative px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
          <div
            className={cn(
              "text-center lg:sticky lg:top-24 lg:w-80 lg:self-start lg:text-left",
              "transition-all duration-700",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            )}
            ref={ref}
          >
            <Text as="span" className="mb-4 block" muted variant="mono">
              FAQ
            </Text>
            <Heading level={2}>
              Common
              <br />
              <span className="text-muted-foreground">questions</span>
            </Heading>
            <Text className="mt-4" variant="caption">
              Everything you need to know about getting started.
            </Text>
          </div>

          <div className="flex-1">
            <div className="space-y-0 divide-y divide-border/50">
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
        </div>
      </div>
    </section>
  );
}

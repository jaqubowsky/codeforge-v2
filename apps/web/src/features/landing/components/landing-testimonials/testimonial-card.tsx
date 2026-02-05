"use client";

import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  delay: number;
}

export function TestimonialCard({
  quote,
  name,
  role,
  company,
  avatar,
  delay,
}: TestimonialCardProps) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      className={cn(
        "h-full transition-all duration-700",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="group relative flex h-full flex-col rounded-lg border border-border/50 bg-card p-8 transition-colors duration-300 hover:border-border">
        <span className="mb-6 block font-display text-5xl text-primary/15 leading-none">
          &ldquo;
        </span>

        <p className="mb-auto flex-1 text-muted-foreground leading-relaxed">
          {quote}
        </p>

        <div className="mt-8 flex items-center gap-3 border-border/30 border-t pt-6">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-foreground font-mono font-semibold text-background text-xs">
            {avatar}
          </div>
          <div>
            <p className="font-semibold text-sm">{name}</p>
            <Text as="span" variant="mono-sm">
              {role} &middot; {company}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

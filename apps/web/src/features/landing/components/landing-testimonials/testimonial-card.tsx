"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { Quote } from "lucide-react";
import { GlassCard } from "@/shared/components/ui/glass-card";
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
      <GlassCard className="relative flex h-full flex-col p-6" hoverable>
        <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />

        <p className="mb-auto flex-1 pr-8 text-muted-foreground leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-sm">
            {avatar}
          </div>
          <div>
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-muted-foreground text-xs">
              {role} &middot; {company}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

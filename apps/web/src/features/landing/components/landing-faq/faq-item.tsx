"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { ChevronDown } from "lucide-react";
import { GlassCard } from "@/shared/components/ui/glass-card";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";

interface FaqItemProps {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}

export function FaqItem({
  question,
  answer,
  index,
  isOpen,
  onToggle,
}: FaqItemProps) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      className={cn(
        "transition-all duration-700",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
      ref={ref}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <GlassCard className="overflow-hidden">
        <button
          className={cn(
            "flex w-full items-center justify-between p-5 text-left",
            "transition-colors duration-200",
            "hover:bg-muted/30"
          )}
          onClick={() => onToggle(index)}
          type="button"
        >
          <span className="pr-4 font-medium">{question}</span>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          />
        </button>
        <div
          className={cn(
            "grid transition-all duration-300",
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <p className="border-border/50 border-t px-5 py-4 text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

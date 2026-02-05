"use client";

import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { Plus } from "lucide-react";
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
      <button
        className={cn(
          "flex w-full items-center justify-between gap-4 py-6 text-left",
          "transition-colors duration-200",
          "hover:text-foreground",
          isOpen ? "text-foreground" : "text-muted-foreground"
        )}
        onClick={() => onToggle(index)}
        type="button"
      >
        <div className="flex items-start gap-4">
          <Text as="span" className="mt-0.5 shrink-0 opacity-50" variant="mono">
            {String(index + 1).padStart(2, "0")}
          </Text>
          <span className="font-medium">{question}</span>
        </div>
        <Plus
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-45"
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
          <p className="pb-6 pl-10 text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

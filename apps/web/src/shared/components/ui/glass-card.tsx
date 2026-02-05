import { cn } from "@codeforge-v2/ui/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  elevated?: boolean;
}

export function GlassCard({
  children,
  className,
  hoverable = false,
  elevated = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50",
        "bg-card/80 backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        hoverable && [
          "hover:border-border",
          "hover:bg-card",
          "hover:shadow-lg",
          "hover:-translate-y-0.5",
        ],
        elevated && "shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

interface GlassCardFooterProps {
  children: ReactNode;
  className?: string;
}

export function GlassCardFooter({ children, className }: GlassCardFooterProps) {
  return (
    <div
      className={cn(
        "border-border/40 border-t bg-muted/20 p-4",
        "rounded-b-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}

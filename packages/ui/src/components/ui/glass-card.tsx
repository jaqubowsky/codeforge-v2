import type * as React from "react";

import { cn } from "../../lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  elevated?: boolean;
}

function GlassCard({
  children,
  className,
  hoverable = false,
  elevated = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/50",
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
      data-slot="glass-card"
    >
      {children}
    </div>
  );
}

interface GlassCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

function GlassCardFooter({ children, className }: GlassCardFooterProps) {
  return (
    <div
      className={cn(
        "rounded-b-lg border-border/40 border-t bg-muted/20 p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export { GlassCard, GlassCardFooter };

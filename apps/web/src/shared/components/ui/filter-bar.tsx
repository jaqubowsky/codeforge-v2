import { cn } from "@codeforge-v2/ui/lib/utils";
import type { ReactNode } from "react";

interface FilterBarProps {
  children: ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm",
        "p-4 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

interface FilterBarRowProps {
  children: ReactNode;
  className?: string;
}

export function FilterBarRow({ children, className }: FilterBarRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-center",
        className
      )}
    >
      {children}
    </div>
  );
}

interface FilterBarExpandableProps {
  children: ReactNode;
  expanded: boolean;
  className?: string;
}

export function FilterBarExpandable({
  children,
  expanded,
  className,
}: FilterBarExpandableProps) {
  if (!expanded) {
    return null;
  }

  return (
    <div className={cn("mt-4 border-border/50 border-t pt-4", className)}>
      {children}
    </div>
  );
}

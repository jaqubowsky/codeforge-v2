import { cn } from "@codeforge-v2/ui/lib/utils";
import type { ReactNode } from "react";

interface PageHeroProps {
  children: ReactNode;
  className?: string;
}

export function PageHero({ children, className }: PageHeroProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "bg-muted/30",
        "border-border/40 border-b",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/0.08,transparent)]" />

      <div className="container relative px-6 py-8 pb-12">{children}</div>
    </div>
  );
}

interface PageHeroHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  statusIndicator?: ReactNode;
  className?: string;
}

export function PageHeroHeader({
  title,
  description,
  action,
  statusIndicator,
  className,
}: PageHeroHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-3xl tracking-tight sm:text-4xl">
            {title}
          </h1>
          {statusIndicator}
        </div>
        {description && (
          <p className="max-w-md text-muted-foreground">{description}</p>
        )}
      </div>

      {action}
    </div>
  );
}

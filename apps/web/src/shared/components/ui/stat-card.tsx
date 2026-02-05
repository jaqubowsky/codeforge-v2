import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  className?: string;
}

export function StatCard({
  icon,
  label,
  value,
  subtext,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg",
        "bg-card/50 backdrop-blur-sm",
        "border border-border/50",
        "p-5 transition-all duration-300",
        "hover:border-border hover:bg-card/80",
        "hover:shadow-lg",
        className
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 h-1 w-full",
          "bg-primary opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100"
        )}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {icon}
            <Text as="span" muted variant="caption">
              {label}
            </Text>
          </div>

          <div className="space-y-0.5">
            <p className="font-semibold text-3xl tracking-tight">{value}</p>
            {subtext && (
              <Text as="span" muted variant="caption">
                {subtext}
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

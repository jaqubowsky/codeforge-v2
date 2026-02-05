import { cn } from "@codeforge-v2/ui/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { SectionColor } from "@/shared/lib/design-tokens";
import { SECTION_COLORS } from "@/shared/lib/design-tokens";

interface ColoredSectionCardProps {
  color: SectionColor;
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function ColoredSectionCard({
  color,
  icon: Icon,
  title,
  description,
  children,
  className,
}: ColoredSectionCardProps) {
  const colorConfig = SECTION_COLORS[color];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center gap-3 border-border/50 border-b px-6 py-4">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            colorConfig.iconBg,
            colorConfig.iconText
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <h2 className="font-semibold text-base">{title}</h2>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

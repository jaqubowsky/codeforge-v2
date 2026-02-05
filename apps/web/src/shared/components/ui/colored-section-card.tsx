import {
  Card,
  CardContent,
  CardHeader,
} from "@codeforge-v2/ui/components/card";
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
    <Card
      className={cn(
        "overflow-hidden border-l-4",
        colorConfig.border,
        className
      )}
    >
      <CardHeader
        className={cn("bg-gradient-to-r to-transparent", colorConfig.gradient)}
      >
        <div className="flex items-center gap-3">
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
      </CardHeader>
      <CardContent className="pt-5">{children}</CardContent>
    </Card>
  );
}

import { Progress } from "@codeforge-v2/ui/components/progress";
import { cn } from "@codeforge-v2/ui/lib/utils";
import type { MatchScoreLevel } from "@/shared/lib/design-tokens";
import { MATCH_SCORE_COLORS } from "@/shared/lib/design-tokens";

interface MatchScoreIndicatorProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
} as const;

function getScoreLevel(percentage: number): MatchScoreLevel {
  if (percentage >= 80) {
    return "excellent";
  }
  if (percentage >= 60) {
    return "good";
  }
  if (percentage >= 40) {
    return "fair";
  }
  return "poor";
}

export function MatchScoreIndicator({
  percentage,
  label = "Match Score",
  showPercentage = true,
  size = "md",
  className,
}: MatchScoreIndicatorProps) {
  const scoreLevel = getScoreLevel(percentage);
  const indicatorColor = MATCH_SCORE_COLORS[scoreLevel];
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div className={cn("space-y-1.5", className)}>
      {showPercentage && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">{label}</span>
          <span className="font-bold text-foreground">{percentage}%</span>
        </div>
      )}
      <Progress
        className={sizeClass}
        indicatorClassName={indicatorColor}
        value={percentage}
      />
    </div>
  );
}

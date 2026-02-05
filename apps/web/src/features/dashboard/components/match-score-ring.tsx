"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import type { MatchScoreLevel } from "@/shared/lib/design-tokens";
import { MATCH_SCORE_COLORS } from "@/shared/lib/design-tokens";

interface MatchScoreRingProps {
  percentage: number;
  size?: "sm" | "md";
  className?: string;
}

const SIZE_CONFIG = {
  sm: { ring: "h-10 w-10", text: "text-xs", stroke: 3 },
  md: { ring: "h-12 w-12", text: "text-sm", stroke: 3 },
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

export function MatchScoreRing({
  percentage,
  size = "md",
  className,
}: MatchScoreRingProps) {
  const config = SIZE_CONFIG[size];
  const scoreLevel = getScoreLevel(percentage);
  const bgColor = MATCH_SCORE_COLORS[scoreLevel];

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        "rounded-full bg-card shadow-sm ring-1 ring-border/20",
        config.ring,
        className
      )}
    >
      <svg
        aria-label={`Match score: ${percentage}%`}
        className="absolute inset-0 -rotate-90"
        role="img"
        viewBox="0 0 40 40"
      >
        <circle
          className="text-border/30"
          cx="20"
          cy="20"
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeWidth={config.stroke}
        />
        <circle
          className={cn(
            "transition-all duration-500",
            bgColor.replace("bg-", "text-")
          )}
          cx="20"
          cy="20"
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={config.stroke}
        />
      </svg>

      <span className={cn("font-semibold", config.text)}>{percentage}</span>
    </div>
  );
}

import { cn } from "@codeforge-v2/ui/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

const VARIANT_CLASSES = {
  text: "h-4 rounded",
  circular: "rounded-full",
  rectangular: "rounded-md",
} as const;

export function Skeleton({
  className,
  variant = "rectangular",
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-secondary",
        VARIANT_CLASSES[variant],
        className
      )}
    />
  );
}

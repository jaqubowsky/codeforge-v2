import { cn } from "@codeforge-v2/ui/lib/utils";

interface CompanyAvatarProps {
  logoUrl?: string | null;
  companyName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-base",
} as const;

const SIZE_DIMENSIONS = {
  sm: 32,
  md: 48,
  lg: 64,
} as const;

export function CompanyAvatar({
  logoUrl,
  companyName,
  size = "md",
  className,
}: CompanyAvatarProps) {
  const initial = companyName?.[0]?.toUpperCase() || "?";
  const sizeClass = SIZE_CLASSES[size];

  if (logoUrl) {
    const dimensions = SIZE_DIMENSIONS[size];

    return (
      // biome-ignore lint/performance/noImgElement: Base UI component, can be wrapped with Next.js Image if needed
      <img
        alt={companyName || "Company"}
        className={cn(
          "shrink-0 rounded-full object-cover",
          sizeClass,
          className
        )}
        height={dimensions}
        src={logoUrl}
        width={dimensions}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-secondary",
        sizeClass,
        className
      )}
    >
      <span className="font-semibold text-muted-foreground">{initial}</span>
    </div>
  );
}

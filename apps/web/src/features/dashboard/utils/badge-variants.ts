import type { BadgeProps } from "@codeforge-v2/ui/components/badge";

export function getWorkplaceBadgeVariant(
  type: string
): NonNullable<BadgeProps["variant"]> {
  const lowerType = type.toLowerCase();
  if (lowerType === "remote") {
    return "remote";
  }
  if (lowerType === "hybrid") {
    return "hybrid";
  }
  return "office";
}

export function getExperienceBadgeVariant(
  level: string
): NonNullable<BadgeProps["variant"]> {
  const lowerLevel = level.toLowerCase();
  if (lowerLevel.includes("senior")) {
    return "info";
  }
  if (lowerLevel.includes("mid")) {
    return "warning";
  }
  return "secondary";
}

"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { FORM_COLORS } from "@/shared/lib/design-tokens";
import { FormCheckbox } from "./form-checkbox";

interface SelectableCardProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
  className?: string;
  layout?: "horizontal" | "vertical";
}

export function SelectableCard({
  id,
  checked,
  onCheckedChange,
  children,
  className,
  layout = "horizontal",
}: SelectableCardProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer rounded-lg border p-3 transition-all",
        layout === "horizontal" && "items-center gap-2.5",
        layout === "vertical" && "flex-col items-center gap-1.5 text-center",
        checked
          ? FORM_COLORS.selectable.selected
          : FORM_COLORS.selectable.default,
        className
      )}
      htmlFor={id}
    >
      <FormCheckbox
        checked={checked}
        id={id}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      {children}
    </label>
  );
}

interface SelectableCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectableCardTitle({
  children,
  className,
}: SelectableCardTitleProps) {
  return (
    <div className={cn("font-medium text-sm", FORM_COLORS.label, className)}>
      {children}
    </div>
  );
}

interface SelectableCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectableCardDescription({
  children,
  className,
}: SelectableCardDescriptionProps) {
  return (
    <div className={cn("text-xs", FORM_COLORS.description, className)}>
      {children}
    </div>
  );
}

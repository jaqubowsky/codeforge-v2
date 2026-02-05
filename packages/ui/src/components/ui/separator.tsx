import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../../lib/utils";

const separatorVariants = cva("shrink-0", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
    variant: {
      solid: "bg-border",
      gradient: "bg-gradient-to-r from-transparent via-border to-transparent",
      decorative: "w-8 bg-border transition-all duration-300 group-hover:w-16",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "solid",
  },
});

type SeparatorProps = {
  className?: string;
} & VariantProps<typeof separatorVariants> &
  React.ComponentProps<"div">;

function Separator({
  orientation,
  variant,
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(separatorVariants({ orientation, variant }), className)}
      data-slot="separator"
      {...props}
    />
  );
}

export { Separator, separatorVariants };

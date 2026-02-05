import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../../lib/utils";

const statusVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-widest",
  {
    variants: {
      variant: {
        success: "border-success/30 text-success",
        info: "border-info/30 text-info",
        warning: "border-warning/30 text-warning",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
);

const dotVariants = cva("size-1.5 animate-pulse rounded-full", {
  variants: {
    variant: {
      success: "bg-success",
      info: "bg-info",
      warning: "bg-warning",
    },
  },
  defaultVariants: {
    variant: "success",
  },
});

type StatusIndicatorProps = {
  className?: string;
  children: React.ReactNode;
} & VariantProps<typeof statusVariants>;

function StatusIndicator({
  variant,
  className,
  children,
}: StatusIndicatorProps) {
  return (
    <span
      className={cn(statusVariants({ variant }), className)}
      data-slot="status-indicator"
    >
      <span aria-hidden="true" className={dotVariants({ variant })} />
      {children}
    </span>
  );
}

export { StatusIndicator, statusVariants };

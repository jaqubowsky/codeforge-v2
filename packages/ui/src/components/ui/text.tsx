import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../../lib/utils";

const textVariants = cva("", {
  variants: {
    variant: {
      body: "text-base leading-relaxed",
      caption: "text-muted-foreground text-sm leading-relaxed",
      mono: "font-mono text-xs uppercase tracking-widest",
      "mono-sm": "font-mono text-[10px] uppercase tracking-widest",
      gradient:
        "bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent",
      lead: "text-lg text-muted-foreground leading-relaxed md:text-xl",
    },
    muted: {
      true: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type TextElement = "p" | "span" | "div" | "label" | "small";

type TextProps<T extends TextElement = "p"> = {
  as?: T;
  variant?: VariantProps<typeof textVariants>["variant"];
  muted?: boolean;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentProps<T>, "className" | "children">;

function Text<T extends TextElement = "p">({
  as,
  variant,
  muted,
  className,
  ...props
}: TextProps<T>) {
  const Comp = as ?? "p";

  return (
    <Comp
      className={cn(
        textVariants({ variant, muted: muted || undefined }),
        className
      )}
      data-slot="text"
      {...(props as Record<string, unknown>)}
    />
  );
}

export { Text, textVariants };

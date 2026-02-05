import type * as React from "react";

import { cn } from "../../lib/utils";

type HeadingLevel = 1 | 2 | 3 | 4;

const headingStyles: Record<HeadingLevel, string> = {
  1: "font-display font-bold text-4xl tracking-tight sm:text-5xl lg:text-7xl",
  2: "font-display font-bold text-3xl tracking-tight sm:text-4xl lg:text-5xl",
  3: "font-semibold text-xl",
  4: "font-semibold text-lg",
};

type HeadingProps = {
  level: HeadingLevel;
  className?: string;
} & Omit<React.ComponentProps<"h1">, "className">;

function Heading({ level, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;

  return (
    <Tag
      className={cn(headingStyles[level], className)}
      data-slot="heading"
      {...props}
    />
  );
}

export { Heading };

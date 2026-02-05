import type * as React from "react";

import { cn } from "../../lib/utils";

type NoiseOverlayProps = {
  className?: string;
} & React.ComponentProps<"div">;

function NoiseOverlay({ className, ...props }: NoiseOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      data-slot="noise-overlay"
      {...props}
    >
      <svg
        aria-hidden="true"
        className="h-full w-full opacity-[0.03] dark:opacity-[0.04]"
        role="img"
      >
        <title>Noise texture</title>
        <filter id="noise-filter">
          <feTurbulence
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
            type="fractalNoise"
          />
        </filter>
        <rect filter="url(#noise-filter)" height="100%" width="100%" />
      </svg>
    </div>
  );
}

export { NoiseOverlay };

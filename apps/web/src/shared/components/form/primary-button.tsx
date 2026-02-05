"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

interface PrimaryButtonProps extends ComponentProps<typeof Button> {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export function PrimaryButton({
  className,
  loading,
  loadingText,
  children,
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      className={cn(
        "h-11 w-full rounded-xl font-medium",
        "shadow-md shadow-primary/20",
        "transition-all duration-200",
        "hover:shadow-lg hover:shadow-primary/30",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || "Loading..."}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

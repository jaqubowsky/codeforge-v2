"use client";

import { Input } from "@codeforge-v2/ui/components/input";
import { cn } from "@codeforge-v2/ui/lib/utils";
import type { ComponentProps, ReactNode } from "react";

interface AuthInputProps extends ComponentProps<typeof Input> {
  icon?: ReactNode;
}

export function AuthInput({ className, icon, ...props }: AuthInputProps) {
  return (
    <div className="relative">
      <Input
        className={cn(
          "h-11 rounded-xl border-border/60 bg-background",
          "placeholder:text-muted-foreground/60",
          "focus-visible:border-primary focus-visible:ring-primary/20",
          icon && "pl-10",
          className
        )}
        {...props}
      />
      {icon && (
        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground/50">
          {icon}
        </div>
      )}
    </div>
  );
}

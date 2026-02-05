"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ModeToggle } from "@/shared/ui/theme-toggle";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footer: ReactNode;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-muted/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/0.06,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_100%_50%,var(--primary)/0.03,transparent)]" />

      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <div className="relative z-10 w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center space-y-6 text-center">
          <Link
            className={cn(
              "flex items-center justify-center",
              "h-12 w-12 rounded-xl",
              "bg-primary text-primary-foreground",
              "shadow-lg shadow-primary/20",
              "transition-transform duration-200 hover:scale-105"
            )}
            href="/"
          >
            <Briefcase className="h-6 w-6" />
          </Link>

          <div className="space-y-2">
            <h1 className="font-display font-semibold text-2xl tracking-tight">
              {title}
            </h1>
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          </div>
        </div>

        <div
          className={cn(
            "rounded-2xl border border-border/50",
            "bg-card/80 backdrop-blur-sm",
            "p-6 shadow-black/5 shadow-xl",
            "dark:shadow-black/20"
          )}
        >
          {children}
        </div>

        <div className="text-center text-muted-foreground text-sm">
          {footer}
        </div>
      </div>

      <div className="absolute bottom-8 text-center text-muted-foreground/60 text-xs">
        <p>LandIT</p>
      </div>
    </div>
  );
}

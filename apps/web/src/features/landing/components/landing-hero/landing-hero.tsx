"use client";

import { Badge } from "@codeforge-v2/ui/components/badge";
import { Button } from "@codeforge-v2/ui/components/button";
import { cn } from "@codeforge-v2/ui/lib/utils";
import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useAuthState } from "@/shared/hooks/use-auth-state";
import { HERO_CONTENT } from "../../constants/content";
import { DashboardMockup } from "./dashboard-mockup";

const SOCIAL_PROOF_INITIALS = ["MK", "JN", "AW", "PL"];

function HeroPrimaryButton({
  isLoading,
  isAuthenticated,
}: {
  isLoading: boolean;
  isAuthenticated: boolean;
}) {
  if (isLoading) {
    return <div className="h-11 w-44 animate-pulse rounded-md bg-muted" />;
  }

  if (isAuthenticated) {
    return (
      <Button asChild className="gap-2 shadow-lg shadow-primary/25" size="lg">
        <Link href="/dashboard">
          <LayoutDashboard className="h-4 w-4" />
          Go to Dashboard
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild className="gap-2 shadow-lg shadow-primary/25" size="lg">
      <Link href="/signup">
        {HERO_CONTENT.ctaPrimary}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}

export function LandingHero() {
  const { isAuthenticated, isLoading } = useAuthState();

  return (
    <section className="relative overflow-hidden pt-16 lg:min-h-screen">
      <div className="absolute inset-0 bg-muted/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/0.12,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_100%_50%,var(--primary)/0.05,transparent)]" />

      <div className="container relative px-6 py-20 lg:py-28">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <Badge className="rounded-full px-4 py-1.5" variant="secondary">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
                {HERO_CONTENT.badge}
              </Badge>

              <h1 className="font-bold font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
                {HERO_CONTENT.headline}
                <br />
                <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {HERO_CONTENT.headlineAccent}
                </span>
              </h1>

              <p className="mx-auto max-w-lg text-lg text-muted-foreground leading-relaxed lg:mx-0">
                {HERO_CONTENT.subheadline}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <HeroPrimaryButton
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
              />
              <Button asChild className="gap-2" size="lg" variant="outline">
                <Link href="#how-it-works">
                  {HERO_CONTENT.ctaSecondary}
                  <ChevronDown className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:gap-6 lg:justify-start">
              <div className="flex -space-x-2">
                {SOCIAL_PROOF_INITIALS.map((initials, i) => (
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      "border-2 border-background bg-muted font-medium text-muted-foreground text-xs",
                      "transition-transform duration-200 hover:-translate-y-1"
                    )}
                    key={initials}
                    style={{ zIndex: SOCIAL_PROOF_INITIALS.length - i }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold text-foreground">500+</span>{" "}
                developers already finding better jobs
              </p>
            </div>
          </div>

          <div className="relative w-full flex-1">
            <DashboardMockup />
          </div>
        </div>
      </div>

      <div className="absolute right-1/2 bottom-8 hidden translate-x-1/2 lg:block">
        <Link
          className={cn(
            "flex flex-col items-center gap-2 text-muted-foreground text-sm",
            "transition-colors hover:text-foreground"
          )}
          href="#benefits"
        >
          <span>Scroll to explore</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </Link>
      </div>
    </section>
  );
}

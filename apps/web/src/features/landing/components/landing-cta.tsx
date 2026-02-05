"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuthState } from "@/shared/hooks/use-auth-state";
import { useScrollReveal } from "@/shared/hooks/use-scroll-reveal";
import { CTA_CONTENT } from "../constants/content";

function CtaButton({
  isLoading,
  isAuthenticated,
}: {
  isLoading: boolean;
  isAuthenticated: boolean;
}) {
  if (isLoading) {
    return <div className="h-11 w-48 animate-pulse rounded-md bg-muted" />;
  }

  if (isAuthenticated) {
    return (
      <Button
        asChild
        className="gap-2 px-8 shadow-lg shadow-primary/25"
        size="lg"
      >
        <Link href="/dashboard">
          <LayoutDashboard className="h-4 w-4" />
          Go to Dashboard
        </Link>
      </Button>
    );
  }

  return (
    <Button
      asChild
      className="gap-2 px-8 shadow-lg shadow-primary/25"
      size="lg"
    >
      <Link href="/signup">
        {CTA_CONTENT.button}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}

export function LandingCta() {
  const { ref, isVisible } = useScrollReveal();
  const { isAuthenticated, isLoading } = useAuthState();

  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,var(--primary)/0.08,transparent)]" />

      <div className="container relative px-6">
        <div
          className={cn(
            "mx-auto max-w-3xl text-center",
            "transition-all duration-700",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          ref={ref}
        >
          <div className="mb-6 inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 p-3">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>

          <h2 className="font-bold font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            {CTA_CONTENT.headline}
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            {CTA_CONTENT.subheadline}
          </p>

          <div className="mt-10">
            <CtaButton
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
            />
          </div>

          {!(isLoading || isAuthenticated) && (
            <p className="mt-6 text-muted-foreground text-sm">
              No credit card required &middot; Free during launch
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

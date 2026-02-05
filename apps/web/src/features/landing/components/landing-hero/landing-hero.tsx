"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { Heading } from "@codeforge-v2/ui/components/heading";
import { NoiseOverlay } from "@codeforge-v2/ui/components/noise-overlay";
import { StatusIndicator } from "@codeforge-v2/ui/components/status-indicator";
import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { ArrowRight, ChevronDown, LayoutDashboard } from "lucide-react";
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
    return <div className="h-12 w-48 animate-pulse rounded-md bg-muted" />;
  }

  if (isAuthenticated) {
    return (
      <Button asChild className="gap-2 px-6" size="lg" variant="dark">
        <Link href="/dashboard">
          <LayoutDashboard className="h-4 w-4" />
          Go to Dashboard
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild className="group gap-2 px-6" size="lg" variant="dark">
      <Link href="/signup">
        {HERO_CONTENT.ctaPrimary}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </Button>
  );
}

export function LandingHero() {
  const { isAuthenticated, isLoading } = useAuthState();

  return (
    <section className="relative overflow-hidden pt-16 lg:min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_-10%,var(--primary)/0.08,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,var(--primary)/0.04,transparent)]" />

      <NoiseOverlay />

      <div className="absolute top-24 left-12 hidden h-px w-32 bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
      <div className="absolute top-48 right-16 hidden h-32 w-px bg-gradient-to-b from-transparent via-border to-transparent lg:block" />

      <div className="container relative px-6 py-20 lg:py-32">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start lg:gap-20">
          <div className="flex-1 space-y-10 text-center lg:text-left">
            <div className="space-y-6">
              <StatusIndicator variant="success">
                {HERO_CONTENT.badge}
              </StatusIndicator>

              <Heading level={1}>
                <span className="block">{HERO_CONTENT.headline}</span>
                <span className="relative mt-2 block">
                  <Text
                    as="span"
                    className="relative z-10 text-[inherit]"
                    variant="gradient"
                  >
                    {HERO_CONTENT.headlineAccent}
                  </Text>
                  <span className="absolute -bottom-2 left-0 hidden h-3 w-full bg-primary/5 lg:block" />
                </span>
              </Heading>

              <Text className="mx-auto max-w-lg lg:mx-0" variant="lead">
                {HERO_CONTENT.subheadline}
              </Text>
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <HeroPrimaryButton
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
              />
              <Button
                asChild
                className="gap-2 font-mono text-xs uppercase tracking-widest"
                size="lg"
                variant="ghost"
              >
                <Link href="#how-it-works">
                  {HERO_CONTENT.ctaSecondary}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4 border-border/30 border-t pt-8 sm:flex-row sm:gap-6 lg:justify-start">
              <div className="flex -space-x-2.5">
                {SOCIAL_PROOF_INITIALS.map((initials, i) => (
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md",
                      "border border-border/50 bg-muted font-mono text-[10px] text-muted-foreground",
                      "transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20"
                    )}
                    key={initials}
                    style={{ zIndex: SOCIAL_PROOF_INITIALS.length - i }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <Text as="span" variant="mono">
                <span className="font-semibold text-foreground">500+</span>{" "}
                developers matched
              </Text>
            </div>
          </div>

          <div className="relative w-full flex-1 lg:mt-8">
            <DashboardMockup />
          </div>
        </div>
      </div>

      <div className="absolute right-1/2 bottom-8 hidden translate-x-1/2 lg:block">
        <Link
          className="flex flex-col items-center gap-2 transition-colors hover:text-foreground"
          href="#benefits"
        >
          <Text as="span" muted variant="mono-sm">
            Scroll
          </Text>
          <ChevronDown className="h-4 w-4 animate-bounce text-muted-foreground" />
        </Link>
      </div>
    </section>
  );
}

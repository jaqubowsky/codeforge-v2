"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { Heading } from "@codeforge-v2/ui/components/heading";
import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { ArrowRight, LayoutDashboard } from "lucide-react";
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
    return <div className="h-12 w-52 animate-pulse rounded-md bg-muted" />;
  }

  if (isAuthenticated) {
    return (
      <Button asChild className="gap-2 px-8" size="lg" variant="dark">
        <Link href="/dashboard">
          <LayoutDashboard className="h-4 w-4" />
          Go to Dashboard
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild className="group gap-2 px-8" size="lg" variant="dark">
      <Link data-umami-event="cta-get-started" href="/signup">
        {CTA_CONTENT.button}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </Button>
  );
}

export function LandingCta() {
  const { ref, isVisible } = useScrollReveal();
  const { isAuthenticated, isLoading } = useAuthState();

  return (
    <section className="relative py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,var(--primary)/0.06,transparent)]" />

      <div className="container relative px-6">
        <div
          className={cn(
            "mx-auto max-w-2xl text-center",
            "transition-all duration-700",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          ref={ref}
        >
          <Text as="span" className="mb-6 block" muted variant="mono">
            Get Started
          </Text>

          <Heading level={2}>{CTA_CONTENT.headline}</Heading>

          <Text className="mx-auto mt-6 max-w-lg" variant="lead">
            {CTA_CONTENT.subheadline}
          </Text>

          <div className="mt-10">
            <CtaButton
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
            />
          </div>

          {!(isLoading || isAuthenticated) && (
            <Text as="span" className="mt-6 block" muted variant="mono-sm">
              No credit card required &middot; Free during launch
            </Text>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

interface DesktopAuthButtonsProps {
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function DesktopAuthButtons({
  isLoading,
  isAuthenticated,
}: DesktopAuthButtonsProps) {
  if (isLoading) {
    return <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />;
  }

  if (isAuthenticated) {
    return (
      <Button asChild className="gap-2" size="sm" variant="dark">
        <Link href="/dashboard">
          <LayoutDashboard className="h-3.5 w-3.5" />
          Dashboard
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Button asChild size="sm" variant="ghost">
        <Link href="/login">Log in</Link>
      </Button>
      <Button asChild size="sm" variant="dark">
        <Link href="/signup">Get Started</Link>
      </Button>
    </>
  );
}

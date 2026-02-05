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
      <Button asChild className="gap-2 shadow-md shadow-primary/20" size="sm">
        <Link href="/dashboard">
          <LayoutDashboard className="h-4 w-4" />
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
      <Button asChild className="shadow-md shadow-primary/20" size="sm">
        <Link href="/signup">Get Started</Link>
      </Button>
    </>
  );
}

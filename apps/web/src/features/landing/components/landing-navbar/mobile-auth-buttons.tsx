"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

interface MobileAuthButtonsProps {
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function MobileAuthButtons({
  isLoading,
  isAuthenticated,
}: MobileAuthButtonsProps) {
  if (isLoading) {
    return <div className="h-10 w-full animate-pulse rounded-md bg-muted" />;
  }

  if (isAuthenticated) {
    return (
      <Button asChild className="gap-2" variant="dark">
        <Link href="/dashboard">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Button asChild variant="outline">
        <Link href="/login">Log in</Link>
      </Button>
      <Button asChild variant="dark">
        <Link href="/signup">Get Started</Link>
      </Button>
    </>
  );
}

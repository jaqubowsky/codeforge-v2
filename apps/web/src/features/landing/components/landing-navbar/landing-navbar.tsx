"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { Briefcase, Menu, X } from "lucide-react";
import Link from "next/link";
import { useAuthState } from "@/shared/hooks/use-auth-state";
import { ModeToggle } from "@/shared/ui/theme-toggle";
import { NAV_LINKS } from "../../constants/content";
import { DesktopAuthButtons } from "./desktop-auth-buttons";
import { MobileAuthButtons } from "./mobile-auth-buttons";
import { useMobileMenu } from "./use-mobile-menu";
import { useNavbarScroll } from "./use-navbar-scroll";

export function LandingNavbar() {
  const isScrolled = useNavbarScroll();
  const { isOpen, toggle, close } = useMobileMenu();
  const { isAuthenticated, isLoading } = useAuthState();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50",
        "transition-all duration-500",
        isScrolled
          ? "border-border/30 border-b bg-background/90 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav className="container flex h-16 items-center justify-between px-6">
        <Link
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          href="/"
        >
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md",
              "bg-foreground text-background",
              "transition-transform duration-300 group-hover:rotate-[-4deg]"
            )}
          >
            <Briefcase className="h-4 w-4" />
          </div>
          <span className="font-mono font-semibold text-sm uppercase tracking-tight">
            LandIT
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              className={cn(
                "relative px-4 py-2 font-mono text-muted-foreground text-xs uppercase tracking-widest",
                "transition-colors duration-200",
                "hover:text-foreground",
                "after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-foreground after:transition-all after:duration-300",
                "hover:after:w-3/4"
              )}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ModeToggle />
          <DesktopAuthButtons
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
          />
        </div>

        <button
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="flex items-center justify-center md:hidden"
          onClick={toggle}
          type="button"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen && (
        <div
          className={cn(
            "border-border/30 border-t bg-background/95 backdrop-blur-xl md:hidden",
            "fade-in slide-in-from-top-2 animate-in duration-200"
          )}
        >
          <div className="container flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                className={cn(
                  "rounded-md px-4 py-3 font-mono text-muted-foreground text-xs uppercase tracking-widest",
                  "transition-colors duration-200",
                  "hover:bg-muted/30 hover:text-foreground"
                )}
                href={link.href}
                key={link.href}
                onClick={close}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-border/30 border-t pt-4">
              <MobileAuthButtons
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
              />
            </div>
            <div className="mt-2 flex justify-center">
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

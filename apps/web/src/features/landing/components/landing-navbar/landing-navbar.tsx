"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { Briefcase, Menu, X } from "lucide-react";
import Link from "next/link";
import { useAuthState } from "@/shared/hooks/use-auth-state";
import { ModeToggle } from "@/shared/ui/theme-toggle";
import { NAV_LINKS } from "../../constants/content";
import { useMobileMenu } from "../../hooks/use-mobile-menu";
import { useNavbarScroll } from "../../hooks/use-navbar-scroll";
import { DesktopAuthButtons } from "./desktop-auth-buttons";
import { MobileAuthButtons } from "./mobile-auth-buttons";

export function LandingNavbar() {
  const isScrolled = useNavbarScroll();

  const { isOpen, toggle, close } = useMobileMenu();
  const { isAuthenticated, isLoading } = useAuthState();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50",
        "transition-all duration-300",
        isScrolled
          ? "border-border/50 border-b bg-background/80 backdrop-blur-lg"
          : "bg-transparent"
      )}
    >
      <nav className="container flex h-16 items-center justify-between px-6">
        <Link
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          href="/"
        >
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              "bg-primary text-primary-foreground",
              "shadow-md shadow-primary/20"
            )}
          >
            <Briefcase className="h-4.5 w-4.5" />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">
            LandIT
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              className={cn(
                "rounded-full px-4 py-2 font-medium text-muted-foreground text-sm",
                "transition-colors duration-200",
                "hover:bg-muted/50 hover:text-foreground"
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
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isOpen && (
        <div
          className={cn(
            "border-border/50 border-t bg-background/95 backdrop-blur-lg md:hidden",
            "fade-in slide-in-from-top-2 animate-in duration-200"
          )}
        >
          <div className="container flex flex-col gap-2 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                className={cn(
                  "rounded-lg px-4 py-3 font-medium text-muted-foreground",
                  "transition-colors duration-200",
                  "hover:bg-muted/50 hover:text-foreground"
                )}
                href={link.href}
                key={link.href}
                onClick={close}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-border/50 border-t pt-4">
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

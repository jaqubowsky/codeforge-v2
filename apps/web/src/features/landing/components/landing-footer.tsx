import { cn } from "@codeforge-v2/ui/lib/utils";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { FOOTER_LINKS } from "../constants/content";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border/50 border-t bg-muted/30">
      <div className="container px-6 py-12">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div className="max-w-sm">
            <Link
              className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
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
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              AI-powered job matching for developers. Stop scrolling, start
              matching.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:justify-end">
            {FOOTER_LINKS.product.map((link) => (
              <Link
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 border-border/50 border-t pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} LandIT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

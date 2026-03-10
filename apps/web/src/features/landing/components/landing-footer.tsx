import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { FOOTER_LINKS } from "../constants/content";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border/30 border-t">
      <div className="container px-6 py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Link
              className="group inline-flex items-center gap-3 transition-opacity hover:opacity-90"
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
                jobZ
              </span>
            </Link>
            <Text className="mt-4" variant="caption">
              AI-powered job matching built for developers who value their time.
            </Text>
          </div>

          <div className="flex gap-16">
            <div>
              <Text as="span" className="mb-4 block" muted variant="mono-sm">
                Product
              </Text>
              <div className="flex flex-col gap-3">
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
            <div>
              <Text as="span" className="mb-4 block" muted variant="mono-sm">
                Legal
              </Text>
              <div className="flex flex-col gap-3">
                {FOOTER_LINKS.legal.map((link) => (
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
          </div>
        </div>

        <div className="mt-16 border-border/30 border-t pt-8">
          <Text as="span" muted variant="mono-sm">
            &copy; {currentYear} jobZ. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  );
}

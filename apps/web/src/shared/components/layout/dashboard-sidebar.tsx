"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { LayoutDashboard, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/features/auth";
import { ModeToggle } from "@/shared/ui/theme-toggle";

const NAV_ITEMS = [
  { href: "/dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile" as const, label: "My Profile", icon: User },
];

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex min-h-screen w-64 flex-col border-r bg-muted/30",
        className
      )}
    >
      <div className="border-b p-6">
        <h1 className="font-bold text-xl">Job Tracker</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                  href={item.href as never}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex items-center justify-between border-t p-4">
        <SignOutButton />
        <ModeToggle />
      </div>
    </aside>
  );
}

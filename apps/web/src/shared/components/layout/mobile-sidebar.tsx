"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          variant="outline"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
          type="button"
        />
      )}

      <DashboardSidebar
        className={cn(
          "fixed inset-y-0 left-0 z-40 transform transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      />
    </div>
  );
}

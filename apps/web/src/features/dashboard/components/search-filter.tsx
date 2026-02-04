"use client";

import { Input } from "@codeforge-v2/ui/components/input";
import { Search } from "lucide-react";
import { STATUS_OPTIONS } from "../constants";
import { useSearchFilters } from "../hooks/use-search-filters";

const STATUS_COLORS = {
  all: {
    active:
      "bg-slate-600 dark:bg-slate-400 text-white dark:text-slate-950 hover:bg-slate-700 dark:hover:bg-slate-300 shadow-sm",
    inactive:
      "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800",
  },
  saved: {
    active:
      "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-400 shadow-sm",
    inactive:
      "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950",
  },
  applied: {
    active:
      "bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-400 shadow-sm",
    inactive:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950",
  },
  interviewing: {
    active:
      "bg-violet-600 dark:bg-violet-500 text-white hover:bg-violet-700 dark:hover:bg-violet-400 shadow-sm",
    inactive:
      "bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-950",
  },
  offered: {
    active:
      "bg-amber-600 dark:bg-amber-500 text-white hover:bg-amber-700 dark:hover:bg-amber-400 shadow-sm",
    inactive:
      "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950",
  },
  rejected: {
    active:
      "bg-rose-600 dark:bg-rose-500 text-white hover:bg-rose-700 dark:hover:bg-rose-400 shadow-sm",
    inactive:
      "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950",
  },
} as const satisfies Record<string, { active: string; inactive: string }>;

export function SearchFilter() {
  const { search, setSearch, status, setStatus } = useSearchFilters();

  const getButtonClass = (value: string) => {
    const isActive = status === value || (!status && value === "all");
    const colors =
      (STATUS_COLORS as Record<string, { active: string; inactive: string }>)[
        value
      ] || STATUS_COLORS.all;
    return `rounded-lg px-4 py-2 font-medium text-sm transition-all ${
      isActive ? colors.active : colors.inactive
    }`;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          onChange={(e) => setSearch(e.target.value || null)}
          placeholder="Search jobs..."
          value={search || ""}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className={getButtonClass("all")}
          onClick={() => setStatus("all")}
          type="button"
        >
          All
        </button>

        {STATUS_OPTIONS.map((opt) => (
          <button
            className={getButtonClass(opt.value)}
            key={opt.value}
            onClick={() => setStatus(opt.value)}
            type="button"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

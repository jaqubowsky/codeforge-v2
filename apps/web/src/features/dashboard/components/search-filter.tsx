"use client";

import { Badge } from "@codeforge-v2/ui/components/badge";
import { Button } from "@codeforge-v2/ui/components/button";
import { Input } from "@codeforge-v2/ui/components/input";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { RotateCcw, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  FilterBar,
  FilterBarExpandable,
  FilterBarRow,
} from "@/shared/components/ui/filter-bar";
import {
  FILTER_BUTTON_STYLES,
  STATUS_INTENT,
} from "@/shared/lib/design-tokens";
import { STATUS_OPTIONS } from "../constants";
import { useDebouncedSearch } from "../hooks/use-debounced-search";
import { useSearchFilters } from "../hooks/use-search-filters";
import type { Currency, SortOption, UserOfferStatus } from "../types";
import { SalaryRangeFilter } from "./salary-range-filter";
import { SortDropdown } from "./sort-dropdown";

type StatusCounts = Record<UserOfferStatus | "all", number>;

interface SearchFilterProps {
  newJobsCount?: number;
  currencies: Currency[];
  maxSalary: number;
  statusCounts: StatusCounts;
}

function getStatusButtonClass(
  currentStatus: string | null,
  buttonValue: string,
  showOnlyNew: boolean
): string {
  const isActive =
    (buttonValue === "new" && showOnlyNew) ||
    (!showOnlyNew && currentStatus === buttonValue);

  if (!isActive) {
    return cn(FILTER_BUTTON_STYLES.base, FILTER_BUTTON_STYLES.inactive);
  }

  if (buttonValue === "all") {
    return cn(FILTER_BUTTON_STYLES.base, FILTER_BUTTON_STYLES.activeDefault);
  }

  const intent = STATUS_INTENT[buttonValue as keyof typeof STATUS_INTENT];
  if (intent) {
    return cn(FILTER_BUTTON_STYLES.base, intent.solid, "shadow-md");
  }

  return cn(
    FILTER_BUTTON_STYLES.base,
    "bg-primary text-primary-foreground shadow-md"
  );
}

export function SearchFilter({
  newJobsCount = 0,
  currencies,
  maxSalary: maxSalaryLimit,
  statusCounts,
}: SearchFilterProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    search,
    setSearch,
    status,
    sort,
    setSort,
    showOnlyNew,
    salaryMin,
    setSalaryMin,
    salaryMax,
    setSalaryMax,
    currency,
    setCurrency,
    setFilters,
    resetFilters,
    hasActiveFilters,
  } = useSearchFilters(maxSalaryLimit);

  const { localValue: localSearch, handleChange: handleSearchChange } =
    useDebouncedSearch({
      value: search,
      onValueChange: setSearch,
    });

  return (
    <div className="space-y-6">
      <FilterBar>
        <FilterBarRow>
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className={cn(
                "h-11 rounded-xl border-border/50 bg-background/50 pl-11",
                "placeholder:text-muted-foreground/60",
                "focus-visible:border-primary/50 focus-visible:ring-primary/20"
              )}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by job title or company..."
              value={localSearch}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SortDropdown
              onChange={setSort}
              value={(sort as SortOption) || "match_desc"}
            />

            <Button
              className={cn(
                "gap-2 rounded-xl",
                showAdvanced && "bg-primary/10 text-primary"
              )}
              onClick={() => setShowAdvanced(!showAdvanced)}
              size="sm"
              variant="outline"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>

            {hasActiveFilters && (
              <Button
                className="gap-1.5 rounded-xl text-muted-foreground"
                onClick={resetFilters}
                size="sm"
                variant="ghost"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </FilterBarRow>

        <FilterBarExpandable expanded={showAdvanced}>
          <SalaryRangeFilter
            availableCurrencies={currencies}
            currency={(currency as Currency) || currencies[0] || "PLN"}
            maxSalary={salaryMax ?? maxSalaryLimit}
            maxSalaryLimit={maxSalaryLimit}
            minSalary={salaryMin ?? 0}
            onCurrencyChange={(curr) => setCurrency(curr as Currency)}
            onMaxChange={setSalaryMax}
            onMinChange={setSalaryMin}
          />
        </FilterBarExpandable>
      </FilterBar>

      <div className="flex flex-wrap items-center gap-2">
        <button
          className={getStatusButtonClass(status, "all", showOnlyNew)}
          onClick={() => {
            setFilters({ status: "all", new: false });
          }}
          type="button"
        >
          All
          <Badge
            className={cn(
              "ml-1 px-1.5 py-0 text-[10px]",
              status === "all" && !showOnlyNew
                ? "bg-background/20 text-inherit"
                : "bg-muted"
            )}
            variant="secondary"
          >
            {statusCounts.all}
          </Badge>
        </button>

        {newJobsCount > 0 && (
          <button
            className={getStatusButtonClass(status, "new", showOnlyNew)}
            onClick={() => {
              setFilters({ status: "saved", new: true });
            }}
            type="button"
          >
            <Sparkles className="h-3.5 w-3.5" />
            New
            <Badge
              className={cn(
                "ml-1 px-1.5 py-0 text-[10px]",
                showOnlyNew
                  ? "bg-background/20 text-inherit"
                  : "bg-primary/10 text-primary"
              )}
              variant="secondary"
            >
              {newJobsCount}
            </Badge>
          </button>
        )}

        <div className="mx-2 h-6 w-px bg-border/50" />

        {STATUS_OPTIONS.map((opt) => (
          <button
            className={getStatusButtonClass(status, opt.value, showOnlyNew)}
            key={opt.value}
            onClick={() => {
              setFilters({ status: opt.value, new: false });
            }}
            type="button"
          >
            {opt.label}
            <Badge
              className={cn(
                "ml-1 px-1.5 py-0 text-[10px]",
                status === opt.value && !showOnlyNew
                  ? "bg-background/20 text-inherit"
                  : "bg-muted"
              )}
              variant="secondary"
            >
              {statusCounts[opt.value]}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { Badge } from "@codeforge-v2/ui/components/badge";
import { Button } from "@codeforge-v2/ui/components/button";
import { Input } from "@codeforge-v2/ui/components/input";
import { Search, Sparkles, X } from "lucide-react";
import { STATUS_OPTIONS } from "../constants";
import { useDebouncedSearch } from "../hooks/use-debounced-search";
import { useSearchFilters } from "../hooks/use-search-filters";
import type { Currency, SortOption, UserOfferStatus } from "../types";
import { getStatusButtonClass } from "../utils/status-button-styles";
import { SalaryRangeFilter } from "./salary-range-filter";
import { SortDropdown } from "./sort-dropdown";

type StatusCounts = Record<UserOfferStatus | "all", number>;

interface SearchFilterProps {
  newJobsCount?: number;
  currencies: Currency[];
  maxSalary: number;
  statusCounts: StatusCounts;
}

export function SearchFilter({
  newJobsCount = 0,
  currencies,
  maxSalary: maxSalaryLimit,
  statusCounts,
}: SearchFilterProps) {
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search jobs by title or company..."
            value={localSearch}
          />
        </div>

        <SortDropdown
          onChange={setSort}
          value={(sort as SortOption) || "match_desc"}
        />

        <Button
          className="gap-1.5"
          disabled={!hasActiveFilters}
          onClick={resetFilters}
          size="sm"
          variant="outline"
        >
          <X className="h-3.5 w-3.5" />
          Clear filters
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          className={getStatusButtonClass(showOnlyNew ? null : status, "all")}
          onClick={() => {
            setFilters({ status: "all", new: false });
          }}
          type="button"
        >
          All ({statusCounts.all})
        </button>

        {STATUS_OPTIONS.map((opt) => (
          <button
            className={getStatusButtonClass(
              showOnlyNew ? null : status,
              opt.value
            )}
            key={opt.value}
            onClick={() => {
              setFilters({ status: opt.value, new: false });
            }}
            type="button"
          >
            {opt.label} ({statusCounts[opt.value]})
          </button>
        ))}

        {newJobsCount > 0 && (
          <button
            className={getStatusButtonClass(showOnlyNew ? "new" : null, "new")}
            onClick={() => {
              setFilters({ status: "saved", new: true });
            }}
            type="button"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              New
              <Badge className="ml-0.5" variant="secondary">
                {newJobsCount}
              </Badge>
            </span>
          </button>
        )}
      </div>

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
    </div>
  );
}

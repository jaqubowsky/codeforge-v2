"use client";

import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { DEFAULT_CURRENCY, SALARY_MAX, SALARY_MIN } from "../constants";
import type { SortOption } from "../types";

const DEFAULT_SEARCH = "";
const DEFAULT_STATUS = "saved";
const DEFAULT_SORT: SortOption = "match_desc";

const filtersParsers = {
  search: parseAsString.withDefault(DEFAULT_SEARCH),
  status: parseAsString.withDefault(DEFAULT_STATUS),
  sort: parseAsString.withDefault(DEFAULT_SORT),
  new: parseAsBoolean.withDefault(false),
  salaryMin: parseAsInteger.withDefault(SALARY_MIN),
  salaryMax: parseAsInteger.withDefault(SALARY_MAX),
  currency: parseAsString.withDefault(DEFAULT_CURRENCY),
};

export function useSearchFilters() {
  const [filters, setFilters] = useQueryStates(filtersParsers, {
    history: "push",
    shallow: false,
    clearOnDefault: true,
  });

  const resetFilters = () => {
    setFilters({
      search: null,
      status: null,
      sort: null,
      new: null,
      salaryMin: null,
      salaryMax: null,
      currency: null,
    });
  };

  const hasActiveFilters =
    filters.search !== DEFAULT_SEARCH ||
    filters.status !== DEFAULT_STATUS ||
    filters.sort !== DEFAULT_SORT ||
    filters.new !== false ||
    filters.salaryMin !== SALARY_MIN ||
    filters.salaryMax !== SALARY_MAX ||
    filters.currency !== DEFAULT_CURRENCY;

  return {
    search: filters.search,
    setSearch: (value: string | null) => setFilters({ search: value }),
    status: filters.status,
    setStatus: (value: string | null) => setFilters({ status: value }),
    sort: filters.sort,
    setSort: (value: string | null) => setFilters({ sort: value }),
    showOnlyNew: filters.new,
    setShowOnlyNew: (value: boolean | null) => setFilters({ new: value }),
    salaryMin: filters.salaryMin,
    setSalaryMin: (value: number | null) => setFilters({ salaryMin: value }),
    salaryMax: filters.salaryMax,
    setSalaryMax: (value: number | null) => setFilters({ salaryMax: value }),
    currency: filters.currency,
    setCurrency: (value: string | null) => setFilters({ currency: value }),
    setFilters,
    resetFilters,
    hasActiveFilters,
  };
}

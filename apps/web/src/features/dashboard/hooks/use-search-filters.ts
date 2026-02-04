"use client";

import { useQueryState } from "nuqs";

const DEFAULT_SEARCH = "";
const DEFAULT_STATUS = "saved";

export function useSearchFilters() {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: DEFAULT_SEARCH,
    clearOnDefault: true,
    shallow: false,
  });

  const [status, setStatus] = useQueryState("status", {
    defaultValue: DEFAULT_STATUS,
    clearOnDefault: true,
    shallow: false,
  });

  return {
    search,
    setSearch,
    status,
    setStatus,
  };
}

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codeforge-v2/ui/components/select";
import { ArrowUpDown } from "lucide-react";
import { SORT_OPTIONS } from "../constants/filter-options";
import type { SortOption } from "../types/dashboard";

function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.some((opt) => opt.value === value);
}

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select
      onValueChange={(v) => {
        if (isSortOption(v)) {
          onChange(v);
        }
      }}
      value={value}
    >
      <SelectTrigger className="w-[180px]">
        <ArrowUpDown className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

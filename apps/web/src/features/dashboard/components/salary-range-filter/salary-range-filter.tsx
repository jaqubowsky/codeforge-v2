"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codeforge-v2/ui/components/select";
import { Slider } from "@codeforge-v2/ui/components/slider";
import { DollarSign } from "lucide-react";
import {
  SALARY_MIN,
  SALARY_STEP,
  VALID_CURRENCIES,
} from "../../constants/filter-options";
import type { Currency } from "../../types/dashboard";
import { formatSalaryRange } from "./salary-utils";
import { useSalaryRangeFilter } from "./use-salary-range-filter";

function isCurrency(value: string): value is Currency {
  return VALID_CURRENCIES.some((v) => v === value);
}

interface SalaryRangeFilterProps {
  minSalary: number;
  maxSalary: number;
  currency: Currency;
  availableCurrencies: Currency[];
  maxSalaryLimit: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  onCurrencyChange: (currency: Currency) => void;
}

export function SalaryRangeFilter({
  minSalary,
  maxSalary,
  currency,
  availableCurrencies,
  maxSalaryLimit,
  onMinChange,
  onMaxChange,
  onCurrencyChange,
}: SalaryRangeFilterProps) {
  const { localMin, localMax, handleRangeChange } = useSalaryRangeFilter({
    minSalary,
    maxSalary,
    onMinChange,
    onMaxChange,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">Salary Range</span>
        </div>
        <Select
          onValueChange={(v) => {
            if (isCurrency(v)) {
              onCurrencyChange(v);
            }
          }}
          value={currency}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableCurrencies.map((curr) => (
              <SelectItem key={curr} value={curr}>
                {curr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Slider
          className="w-full"
          max={maxSalaryLimit}
          min={SALARY_MIN}
          onValueChange={handleRangeChange}
          step={SALARY_STEP}
          value={[localMin, localMax]}
        />
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>
            {formatSalaryRange(localMin, localMax, currency, maxSalaryLimit)}
          </span>
          {localMin === 0 && localMax < maxSalaryLimit && (
            <span className="text-primary">Includes jobs without salary</span>
          )}
          {localMax === maxSalaryLimit && (
            <span className="text-primary">No upper limit</span>
          )}
        </div>
      </div>
    </div>
  );
}

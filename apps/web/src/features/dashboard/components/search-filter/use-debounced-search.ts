"use client";

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "@/shared/hooks/use-debounced-callback";

interface UseDebouncedSearchProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
  delay?: number;
}

export function useDebouncedSearch({
  value,
  onValueChange,
  delay = 300,
}: UseDebouncedSearchProps) {
  const [localValue, setLocalValue] = useState(value || "");

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const debouncedOnValueChange = useDebouncedCallback(onValueChange, delay);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    debouncedOnValueChange(newValue || null);
  };

  return {
    localValue,
    handleChange,
  };
}

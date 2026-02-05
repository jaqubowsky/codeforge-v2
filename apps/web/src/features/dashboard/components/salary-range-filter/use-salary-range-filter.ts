"use client";

import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "@/shared/hooks/use-debounced-callback";

interface UseSalaryRangeFilterProps {
  minSalary: number;
  maxSalary: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export function useSalaryRangeFilter({
  minSalary,
  maxSalary,
  onMinChange,
  onMaxChange,
}: UseSalaryRangeFilterProps) {
  const [localMin, setLocalMin] = useState(minSalary);
  const [localMax, setLocalMax] = useState(maxSalary);

  const debouncedMinChange = useDebouncedCallback(onMinChange, 500);
  const debouncedMaxChange = useDebouncedCallback(onMaxChange, 500);

  const debouncedMinRef = useRef(debouncedMinChange);
  const debouncedMaxRef = useRef(debouncedMaxChange);

  useEffect(() => {
    debouncedMinRef.current = debouncedMinChange;
    debouncedMaxRef.current = debouncedMaxChange;
  }, [debouncedMinChange, debouncedMaxChange]);

  useEffect(() => {
    setLocalMin(minSalary);
    setLocalMax(maxSalary);
    debouncedMinRef.current.cancel();
    debouncedMaxRef.current.cancel();
  }, [minSalary, maxSalary]);

  const handleRangeChange = (values: number[]) => {
    if (values[0] !== undefined) {
      setLocalMin(values[0]);
      debouncedMinChange(values[0]);
    }

    if (values[1] !== undefined) {
      setLocalMax(values[1]);
      debouncedMaxChange(values[1]);
    }
  };

  return {
    localMin,
    localMax,
    handleRangeChange,
  };
}

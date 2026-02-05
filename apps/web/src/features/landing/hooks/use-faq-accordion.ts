"use client";

import { useCallback, useState } from "react";

export function useFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const isOpen = useCallback(
    (index: number) => openIndex === index,
    [openIndex]
  );

  return { toggle, isOpen };
}

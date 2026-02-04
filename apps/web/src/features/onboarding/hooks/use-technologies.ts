"use client";

import { useEffect, useState } from "react";
import { getTechnologies } from "../api";
import type { Technology } from "../types";

export function useTechnologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTechnologies() {
      try {
        const result = await getTechnologies();
        if (result.success) {
          setTechnologies(result.data);
          setError(null);
        } else {
          setError(result.error || "Failed to load technologies");
        }
      } catch {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchTechnologies();
  }, []);

  return { technologies, loading, error };
}

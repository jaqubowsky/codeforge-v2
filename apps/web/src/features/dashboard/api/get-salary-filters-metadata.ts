"use server";

import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createClient } from "@/shared/supabase/server";
import type { Currency, SalaryFiltersMetadata } from "../types";

const VALID_CURRENCIES: Currency[] = ["PLN", "EUR", "USD", "GBP"];

function isCurrency(value: string): value is Currency {
  return VALID_CURRENCIES.includes(value as Currency);
}

export async function getSalaryFiltersMetadata(): Promise<
  Result<SalaryFiltersMetadata>
> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return err("Not authenticated");
  }

  const { data: jobsData, error: jobsError } = await supabase
    .from("user_offers")
    .select(
      `
      offers (
        salary_currency,
        salary_to,
        salary_from
      )
    `
    )
    .eq("user_id", user.id);

  if (jobsError) {
    return err(jobsError.message);
  }

  const currenciesSet = new Set<Currency>();
  const salaries: number[] = [];

  for (const item of jobsData || []) {
    const job = item.offers;
    if (!job) {
      continue;
    }

    if (job.salary_currency && isCurrency(job.salary_currency)) {
      currenciesSet.add(job.salary_currency);
    }

    const salary = job.salary_to || job.salary_from;
    if (salary && salary > 0 && salary <= 1_000_000) {
      salaries.push(salary);
    }
  }

  const currencies = Array.from(currenciesSet).sort();

  if (currencies.length === 0) {
    currencies.push("PLN");
  }

  let maxSalary = 50_000;

  if (salaries.length > 0) {
    salaries.sort((a, b) => a - b);
    const p95Index = Math.min(
      Math.floor(salaries.length * 0.95),
      salaries.length - 1
    );
    const p95Value = salaries[p95Index];
    if (p95Value) {
      maxSalary = Math.max(p95Value, 50_000);
    }
  }

  return ok({
    currencies,
    maxSalary: Math.ceil(maxSalary / 1000) * 1000,
  });
}

"use server";

import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createAuthenticatedClient } from "@/shared/supabase/server";
import { getSalaryFiltersMetadata, getUserJobs } from "../api";
import type { DashboardData } from "../types/dashboard";
import { mapMatchRunInfo } from "./mappers/dashboard";

export async function getDashboardData(): Promise<Result<DashboardData>> {
  const authResult = await createAuthenticatedClient();
  if (!authResult.success) {
    return authResult;
  }
  const { supabase, userId } = authResult.data;

  const [jobsResult, salaryMetadataResult] = await Promise.all([
    getUserJobs(undefined, 100),
    getSalaryFiltersMetadata(),
  ]);

  if (!jobsResult.success) {
    return err(jobsResult.error);
  }

  if (!salaryMetadataResult.success) {
    return err(salaryMetadataResult.error);
  }

  const { data: lastRun } = await supabase
    .from("match_runs")
    .select("created_at, jobs_found, new_jobs_count, status")
    .eq("user_id", userId)
    .gt("new_jobs_count", 0)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return ok({
    jobs: jobsResult.data,
    totalCount: jobsResult.data.length,
    lastRun: mapMatchRunInfo(lastRun),
    salaryMetadata: salaryMetadataResult.data,
  });
}

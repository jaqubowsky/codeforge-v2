"use server";

import { createClient } from "@/shared/supabase/server";
import { getUserJobs } from "../api";
import type { DashboardData, MatchRunInfo } from "../types";

async function getLastRunFromDB(userId: string): Promise<MatchRunInfo> {
  const supabase = await createClient();

  const { data: lastRun } = await supabase
    .from("match_runs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return lastRun
    ? {
        lastRunAt: lastRun.created_at,
        jobsFound: lastRun.jobs_found ?? 0,
        newJobsCount: lastRun.new_jobs_count ?? 0,
        status: lastRun.status,
      }
    : {
        lastRunAt: null,
        jobsFound: 0,
        newJobsCount: 0,
        status: null,
      };
}

export async function getDashboardData(): Promise<{
  success: boolean;
  data?: DashboardData;
  error: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const jobsResult = await getUserJobs(undefined, 100);

  if (!jobsResult.success) {
    return { success: false, error: jobsResult.error };
  }

  const lastRun = await getLastRunFromDB(user.id);

  return {
    success: true,
    data: {
      jobs: jobsResult.data ?? [],
      totalCount: jobsResult.data?.length ?? 0,
      lastRun,
    },
    error: null,
  };
}

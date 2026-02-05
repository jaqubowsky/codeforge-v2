"use server";

import { revalidatePath } from "next/cache";
import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createClient } from "@/shared/supabase/server";
import type { TriggerMatchData } from "../types";
import { matchJobs } from "./match-jobs";

export async function triggerMatch(): Promise<Result<TriggerMatchData>> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return err("Not authenticated");
  }

  const { data: matchRun, error: createError } = await supabase
    .from("match_runs")
    .insert({
      user_id: user.id,
      status: "running",
    })
    .select()
    .single();

  if (createError || !matchRun) {
    return err("Failed to create match run");
  }

  const result = await matchJobs();

  const finalStatus = result.success ? "completed" : "failed";

  const { error: updateError } = await supabase
    .from("match_runs")
    .update({
      finished_at: new Date().toISOString(),
      status: finalStatus,
      new_jobs_count: result.success ? result.data.newMatchesCount : 0,
      error_message: result.success ? null : result.error,
    })
    .eq("id", matchRun.id);

  if (updateError) {
    return err("Failed to update match run status");
  }

  revalidatePath("/dashboard");

  if (!result.success) {
    return err(result.error);
  }

  return ok({ newJobsCount: result.data.newMatchesCount });
}

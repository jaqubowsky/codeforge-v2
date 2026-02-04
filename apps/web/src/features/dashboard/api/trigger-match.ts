"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/supabase/server";
import { matchJobs } from "./match-jobs";

export async function triggerMatch(): Promise<{
  success: boolean;
  newJobsCount?: number;
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

  const { data: matchRun, error: createError } = await supabase
    .from("match_runs")
    .insert({
      user_id: user.id,
      status: "running",
    })
    .select()
    .single();

  if (createError || !matchRun) {
    return { success: false, error: "Failed to create match run" };
  }

  const result = await matchJobs();

  const finalStatus = result.success ? "completed" : "failed";

  const { error: updateError } = await supabase
    .from("match_runs")
    .update({
      finished_at: new Date().toISOString(),
      status: finalStatus,
      new_jobs_count: result.newMatchesCount ?? 0,
      error_message: result.error,
    })
    .eq("id", matchRun.id);

  if (updateError) {
    return { success: false, error: "Failed to update match run status" };
  }

  revalidatePath("/dashboard");

  return result;
}

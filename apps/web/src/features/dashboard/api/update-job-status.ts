"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/supabase/server";
import type { UpdateJobStatusResult, UserOfferStatus } from "../types";

export async function updateJobStatus(
  offerId: number,
  status: UserOfferStatus
): Promise<UpdateJobStatusResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: "You must be logged in to update job status",
    };
  }

  const { error } = await supabase
    .from("user_offers")
    .update({ status })
    .eq("user_id", user.id)
    .eq("offer_id", offerId);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    error: null,
  };
}

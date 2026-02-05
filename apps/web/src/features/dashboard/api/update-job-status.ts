"use server";

import { revalidatePath } from "next/cache";
import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createClient } from "@/shared/supabase/server";
import type { UserOfferStatus } from "../types";

export async function updateJobStatus(
  offerId: number,
  status: UserOfferStatus
): Promise<Result<void>> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return err("You must be logged in to update job status");
  }

  const { error } = await supabase
    .from("user_offers")
    .update({ status })
    .eq("user_id", user.id)
    .eq("offer_id", offerId);

  if (error) {
    return err(error.message);
  }

  revalidatePath("/dashboard");

  return ok(undefined);
}

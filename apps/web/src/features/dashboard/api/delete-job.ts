"use server";

import { revalidatePath } from "next/cache";
import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createAuthenticatedClient } from "@/shared/supabase/server";

export async function deleteJob(offerId: number): Promise<Result<void>> {
  const authResult = await createAuthenticatedClient();
  if (!authResult.success) {
    return authResult;
  }
  const { supabase, userId } = authResult.data;

  const { error } = await supabase
    .from("user_offers")
    .update({ status: "deleted" })
    .eq("user_id", userId)
    .eq("offer_id", offerId);

  if (error) {
    return err(error.message);
  }

  revalidatePath("/dashboard");

  return ok(undefined);
}

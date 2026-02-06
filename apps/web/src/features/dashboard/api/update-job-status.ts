"use server";

import { revalidatePath } from "next/cache";
import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";
import { createAuthenticatedClient } from "@/shared/supabase/server";
import type { UserOfferStatus } from "../types/dashboard";

export async function updateJobStatus(
  offerId: number,
  status: UserOfferStatus
): Promise<Result<void>> {
  const authResult = await createAuthenticatedClient();
  if (!authResult.success) {
    return authResult;
  }
  const { supabase, userId } = authResult.data;

  const { error } = await supabase
    .from("user_offers")
    .update({ status })
    .eq("user_id", userId)
    .eq("offer_id", offerId);

  if (error) {
    return err(error.message);
  }

  revalidatePath("/dashboard");

  return ok(undefined);
}

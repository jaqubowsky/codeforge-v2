"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/supabase/server";

export async function deleteJob(offerId: number): Promise<{
  success: boolean;
  error: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: "You must be logged in to delete jobs",
    };
  }

  const { error } = await supabase
    .from("user_offers")
    .delete()
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

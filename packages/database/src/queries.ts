import { adminClient } from "./client";
import type { TablesInsert, TablesUpdate } from "./database.types";

function getAdminClient() {
  if (!adminClient) {
    throw new Error(
      "adminClient is not available. SUPABASE_SERVICE_KEY environment variable is required for server-side operations."
    );
  }
  return adminClient;
}

export const scraping_runs = {
  create: (newRun: TablesInsert<"scraping_runs">) => {
    return getAdminClient()
      .from("scraping_runs")
      .insert(newRun)
      .select()
      .single();
  },

  update: (runId: number, updates: TablesUpdate<"scraping_runs">) => {
    return getAdminClient()
      .from("scraping_runs")
      .update(updates)
      .eq("id", runId);
  },
};

export const offers = {
  upsertOne: (offer: TablesInsert<"offers">) => {
    return getAdminClient()
      .from("offers")
      .upsert(offer, { onConflict: "offer_url" })
      .select()
      .single();
  },

  upsertMany: (offersList: TablesInsert<"offers">[]) => {
    return getAdminClient()
      .from("offers")
      .upsert(offersList, { onConflict: "offer_url" })
      .select();
  },
};

export const technologies = {
  getOrCreateId: (name: string) => {
    return getAdminClient().rpc("get_or_create_technology", {
      tech_name: name,
    });
  },
};

export const offer_technologies = {
  linkManyToOffer: (links: TablesInsert<"offer_technologies">[]) => {
    return getAdminClient().from("offer_technologies").upsert(links);
  },
};

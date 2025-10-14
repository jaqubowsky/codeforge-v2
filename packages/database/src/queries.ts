import { adminClient } from "./client";
import type { TablesInsert, TablesUpdate } from "./database.types";

export const scraping_runs = {
  /**
   * Creates a new scraping run record and returns it.
   */
  create: (newRun: TablesInsert<"scraping_runs">) => {
    return adminClient.from("scraping_runs").insert(newRun).select().single();
  },

  /**
   * Updates an existing scraping run.
   */
  update: (runId: number, updates: TablesUpdate<"scraping_runs">) => {
    return adminClient.from("scraping_runs").update(updates).eq("id", runId);
  },
};

export const offers = {
  /**
   * Inserts an array of new offers.
   */
  createMany: (newOffers: TablesInsert<"offers">[]) => {
    return adminClient.from("offers").insert(newOffers);
  },
};

export const technology_counts = {
  /**
   * Inserts an array of new technology counts.
   */
  createMany: (newTechnologyCounts: TablesInsert<"technology_counts">[]) => {
    return adminClient.from("technology_counts").insert(newTechnologyCounts);
  },
};

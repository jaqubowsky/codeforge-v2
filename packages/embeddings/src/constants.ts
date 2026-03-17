export const REGULAR_PROVIDERS = {
  LOCAL: "local",
  OPENAI: "openai",
} as const;

export const RERANKER_PROVIDERS = {
  LOCAL: "local",
} as const;

export type REGULAR_PROVIDERS = keyof typeof REGULAR_PROVIDERS;
export type RERANKER_PROVIDERS = keyof typeof RERANKER_PROVIDERS;

export const MODEL_IDS = {
  [REGULAR_PROVIDERS.LOCAL]: "Xenova/all-MiniLM-L6-v2",
  [REGULAR_PROVIDERS.OPENAI]: "text-embedding-ada-002",
} as const;

export type REGULAR_MODELS = keyof typeof MODEL_IDS;

export const DIMENSIONS = {
  [REGULAR_PROVIDERS.LOCAL]: 384,
  [REGULAR_PROVIDERS.OPENAI]: 1536,
} as const;

export const INPUT_LIMITS = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 10_000,
} as const;

export const RERANKER_MODEL_IDS = {
  [RERANKER_PROVIDERS.LOCAL]: "Xenova/ms-marco-MiniLM-L-6-v2",
} as const;

export type RERANKER_MODELS = keyof typeof RERANKER_MODEL_IDS;

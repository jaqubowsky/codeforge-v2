export const PROVIDERS = {
  LOCAL: "local",
  OPENAI: "openai",
} as const;

export const MODEL_IDS = {
  [PROVIDERS.LOCAL]: "Xenova/all-MiniLM-L6-v2",
  [PROVIDERS.OPENAI]: "text-embedding-ada-002",
} as const;

export const DIMENSIONS = {
  [PROVIDERS.LOCAL]: 384,
  [PROVIDERS.OPENAI]: 1536,
} as const;

export const INPUT_LIMITS = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 10_000,
} as const;

export const RERANKER_MODEL_IDS = {
  local: "Xenova/ms-marco-MiniLM-L-6-v2",
} as const;

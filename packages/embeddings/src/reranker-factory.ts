import { type RERANKER_MODELS, RERANKER_PROVIDERS } from "./constants";
import { createLocalReRanker } from "./providers/local-reranker";
import type { ReRanker } from "./types";

const rerankerCache = new Map<string, ReRanker>();

export function createReRanker(provider?: RERANKER_MODELS): ReRanker {
  const selectedProvider = provider || RERANKER_PROVIDERS.LOCAL;

  if (rerankerCache.has(selectedProvider)) {
    return rerankerCache.get(selectedProvider)!;
  }

  let reranker: ReRanker;

  switch (selectedProvider) {
    case RERANKER_PROVIDERS.LOCAL:
      reranker = createLocalReRanker();
      break;

    default: {
      const _exhaustivenessCheck: never = selectedProvider;
      throw new Error(`Unknown reranker provider: ${selectedProvider}`);
    }
  }

  rerankerCache.set(selectedProvider, reranker);
  return reranker;
}

export function getDefaultReRanker(): ReRanker {
  return createReRanker();
}

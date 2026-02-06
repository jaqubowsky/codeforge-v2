import { createLocalReRanker } from "./providers/local-reranker";
import type { ReRanker } from "./types";

const rerankerCache = new Map<string, ReRanker>();

export function createReRanker(provider?: string): ReRanker {
  const selectedProvider = provider || "local";

  if (rerankerCache.has(selectedProvider)) {
    return rerankerCache.get(selectedProvider)!;
  }

  let reranker: ReRanker;

  switch (selectedProvider) {
    case "local":
      reranker = createLocalReRanker();
      break;

    default:
      throw new Error(`Unknown reranker provider: ${selectedProvider}`);
  }

  rerankerCache.set(selectedProvider, reranker);
  return reranker;
}

export function getDefaultReRanker(): ReRanker {
  return createReRanker();
}

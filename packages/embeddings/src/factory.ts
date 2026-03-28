import { type REGULAR_MODELS, REGULAR_PROVIDERS } from "./constants";
import { createLocalProvider } from "./providers/local";
import type { EmbeddingProvider } from "./types";

const providerCache = new Map<string, EmbeddingProvider>();

export function createEmbeddingProvider(
  provider?: REGULAR_MODELS
): EmbeddingProvider {
  const selectedProvider = provider || REGULAR_PROVIDERS.LOCAL;

  if (providerCache.has(selectedProvider)) {
    return providerCache.get(selectedProvider)!;
  }

  let model: EmbeddingProvider;

  switch (selectedProvider) {
    case REGULAR_PROVIDERS.LOCAL:
      model = createLocalProvider();
      break;

    default: {
      const _exhaustivenessCheck: never = selectedProvider;
      throw new Error(`Unknown provider: ${provider}`);
    }
  }

  providerCache.set(selectedProvider, model);
  return model;
}

export function getDefaultProvider(): EmbeddingProvider {
  return createEmbeddingProvider();
}

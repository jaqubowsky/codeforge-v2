import { PROVIDERS } from "./constants";
import { createLocalProvider } from "./providers/local";
import { createOpenAIProvider } from "./providers/openai";
import type { EmbeddingConfig, EmbeddingProvider, ProviderType } from "./types";
import { validateConfig } from "./validation";

const providerCache = new Map<string, EmbeddingProvider>();

export function createEmbeddingProvider(
  config?: Partial<EmbeddingConfig>
): EmbeddingProvider {
  const defaultConfig: EmbeddingConfig = {
    provider:
      (process.env.EMBEDDING_PROVIDER as ProviderType | undefined) ||
      PROVIDERS.LOCAL,
    modelName: config?.modelName,
  };

  const finalConfig: EmbeddingConfig = {
    ...defaultConfig,
    ...config,
  };

  validateConfig(finalConfig);

  const cacheKey = `${finalConfig.provider}:${finalConfig.modelName || "default"}`;

  if (providerCache.has(cacheKey)) {
    return providerCache.get(cacheKey)!;
  }

  let provider: EmbeddingProvider;

  switch (finalConfig.provider) {
    case PROVIDERS.LOCAL:
      provider = createLocalProvider();
      break;

    case PROVIDERS.OPENAI:
      provider = createOpenAIProvider();
      break;

    default:
      throw new Error(`Unknown provider: ${finalConfig.provider}`);
  }

  providerCache.set(cacheKey, provider);
  return provider;
}

export function getDefaultProvider(): EmbeddingProvider {
  return createEmbeddingProvider();
}

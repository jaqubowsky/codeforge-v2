import { DIMENSIONS, MODEL_IDS, REGULAR_PROVIDERS } from "../constants";
import { ProviderNotImplementedError } from "../errors";
import type { EmbeddingProvider } from "../types";

function generateEmbedding(_text: string): Promise<number[]> {
  return Promise.reject(
    new ProviderNotImplementedError(REGULAR_PROVIDERS.OPENAI)
  );
}

function getDimensions(): number {
  return DIMENSIONS[REGULAR_PROVIDERS.OPENAI];
}

function getName(): string {
  return `${REGULAR_PROVIDERS.OPENAI} (${MODEL_IDS[REGULAR_PROVIDERS.OPENAI]} - not implemented)`;
}

export function createOpenAIProvider(): EmbeddingProvider {
  return {
    generateEmbedding,
    getDimensions,
    getName,
  };
}

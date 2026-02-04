import { DIMENSIONS, MODEL_IDS, PROVIDERS } from "../constants";
import { ProviderNotImplementedError } from "../errors";
import type { EmbeddingProvider } from "../types";

function generateEmbedding(_text: string): Promise<number[]> {
  return Promise.reject(new ProviderNotImplementedError(PROVIDERS.OPENAI));
}

function getDimensions(): number {
  return DIMENSIONS[PROVIDERS.OPENAI];
}

function getName(): string {
  return `${PROVIDERS.OPENAI} (${MODEL_IDS[PROVIDERS.OPENAI]} - not implemented)`;
}

export function createOpenAIProvider(): EmbeddingProvider {
  return {
    generateEmbedding,
    getDimensions,
    getName,
  };
}

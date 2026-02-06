import type { PROVIDERS } from "./constants";

export type ProviderType = (typeof PROVIDERS)[keyof typeof PROVIDERS];

export interface EmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>;
  getDimensions(): number;
  getName(): string;
}

export interface EmbeddingConfig {
  provider: ProviderType;
  modelName?: string;
}

export interface RankedDocument {
  index: number;
  score: number;
}

export interface ReRanker {
  rankPairs(query: string, documents: string[]): Promise<RankedDocument[]>;
  getName(): string;
}

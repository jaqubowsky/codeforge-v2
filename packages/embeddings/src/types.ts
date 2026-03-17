export interface EmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>;
  getDimensions(): number;
  getName(): string;
}

export interface ReRanker {
  rankPairs(query: string, documents: string[]): Promise<RankedDocument[]>;
  getName(): string;
}

export interface RankedDocument {
  index: number;
  score: number;
}

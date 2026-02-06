export { EmbeddingError, RerankingError } from "./errors";
export { createEmbeddingProvider } from "./factory";
export type { EmbeddingProvider, RankedDocument, ReRanker } from "./types";

import { getDefaultProvider } from "./factory";
export const embeddings = getDefaultProvider();

export { createReRanker } from "./reranker-factory";

import { getDefaultReRanker } from "./reranker-factory";
export const reranker = getDefaultReRanker();

export type { JobDocumentData, ProfileQueryData } from "./text-formatting";
export {
  formatJobDocument,
  formatProfileQuery,
} from "./text-formatting";

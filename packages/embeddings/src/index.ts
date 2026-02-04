export { EmbeddingError } from "./errors";
export { createEmbeddingProvider } from "./factory";
export type { EmbeddingProvider } from "./types";

import { getDefaultProvider } from "./factory";
export const embeddings = getDefaultProvider();

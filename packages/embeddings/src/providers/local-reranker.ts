import {
  AutoModelForSequenceClassification,
  AutoTokenizer,
  env as transformersEnv,
} from "@xenova/transformers";
import { RERANKER_MODEL_IDS } from "../constants";
import { ModelLoadError, RerankingError, ValidationError } from "../errors";
import type { RankedDocument, ReRanker } from "../types";
import { validateInput } from "../validation";

// biome-ignore lint/suspicious/noExplicitAny: Transformers.js model/tokenizer types are complex and not fully exported
type ModelType = any;
// biome-ignore lint/suspicious/noExplicitAny: Transformers.js model/tokenizer types are complex and not fully exported
type TokenizerType = any;

const PROVIDER_NAME = "local-reranker";

let tokenizerInstance: TokenizerType = null;
let modelInstance: ModelType = null;
let loadPromise: Promise<void> | null = null;

transformersEnv.allowLocalModels = false;
transformersEnv.useBrowserCache = false;

if (process.env.TRANSFORMERS_CACHE) {
  transformersEnv.cacheDir = process.env.TRANSFORMERS_CACHE;
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

async function initializeModel(): Promise<void> {
  try {
    const modelId = RERANKER_MODEL_IDS.local;
    const [tokenizer, model] = await Promise.all([
      AutoTokenizer.from_pretrained(modelId),
      AutoModelForSequenceClassification.from_pretrained(modelId),
    ]);
    tokenizerInstance = tokenizer;
    modelInstance = model;
  } catch (error) {
    throw new ModelLoadError(PROVIDER_NAME, error);
  }
}

async function loadModel(): Promise<void> {
  if (tokenizerInstance && modelInstance) {
    return;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = initializeModel();

  try {
    await loadPromise;
  } catch (error) {
    loadPromise = null;
    throw error;
  }
}

async function rankPairs(
  query: string,
  documents: string[]
): Promise<RankedDocument[]> {
  if (documents.length === 0) {
    return [];
  }

  let validatedQuery: string;
  try {
    validatedQuery = validateInput(query);
  } catch (error) {
    throw new ValidationError(
      error instanceof Error ? error.message : "Invalid query input",
      PROVIDER_NAME
    );
  }

  for (const doc of documents) {
    try {
      validateInput(doc);
    } catch (error) {
      throw new ValidationError(
        error instanceof Error ? error.message : "Invalid document input",
        PROVIDER_NAME
      );
    }
  }

  await loadModel();

  try {
    const results: RankedDocument[] = [];
    for (let i = 0; i < documents.length; i++) {
      const inputs = tokenizerInstance(validatedQuery, {
        text_pair: documents[i],
        padding: true,
        truncation: true,
      });
      const output = await modelInstance(inputs);
      const logit = output.logits.data[0];
      results.push({ index: i, score: sigmoid(logit) });
    }
    return results.sort((a, b) => b.score - a.score);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new RerankingError(PROVIDER_NAME, error);
  }
}

function getName(): string {
  return `${PROVIDER_NAME} (${RERANKER_MODEL_IDS.local})`;
}

export function createLocalReRanker(): ReRanker {
  return {
    rankPairs,
    getName,
  };
}

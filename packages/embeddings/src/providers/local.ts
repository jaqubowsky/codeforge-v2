import {
  type FeatureExtractionPipeline,
  pipeline,
  env as transformersEnv,
} from "@huggingface/transformers";
import { DIMENSIONS, MODEL_IDS, REGULAR_PROVIDERS } from "../constants";
import {
  EmbeddingError,
  InvalidDimensionsError,
  ModelLoadError,
  ValidationError,
} from "../errors";
import type { EmbeddingProvider } from "../types";
import { validateInput } from "../validation";

type PipelineType = FeatureExtractionPipeline | null;

let modelInstance: PipelineType = null;
let modelPromise: Promise<PipelineType> | null = null;

transformersEnv.allowLocalModels = false;
transformersEnv.useBrowserCache = false;

if (process.env.TRANSFORMERS_CACHE) {
  transformersEnv.cacheDir = process.env.TRANSFORMERS_CACHE;
}

async function initializeModel(): Promise<PipelineType> {
  try {
    const model = await pipeline(
      "feature-extraction",
      MODEL_IDS[REGULAR_PROVIDERS.LOCAL]
    );

    return model;
  } catch (error) {
    throw new ModelLoadError(REGULAR_PROVIDERS.LOCAL, error);
  }
}

async function loadModel(): Promise<PipelineType> {
  if (modelInstance) {
    return modelInstance;
  }

  if (modelPromise) {
    return modelPromise;
  }

  modelPromise = initializeModel();

  try {
    modelInstance = await modelPromise;
    return modelInstance;
  } catch (error) {
    modelPromise = null;
    throw error;
  }
}

async function generateEmbedding(text: string): Promise<number[]> {
  let validatedText: string;

  try {
    validatedText = validateInput(text);
  } catch (error) {
    throw new ValidationError(
      error instanceof Error ? error.message : "Invalid input",
      REGULAR_PROVIDERS.LOCAL
    );
  }

  const model = await loadModel();
  if (!model) {
    throw new ModelLoadError(REGULAR_PROVIDERS.LOCAL);
  }

  try {
    const output = await model(validatedText, {
      pooling: "mean",
      normalize: true,
    });

    const embedding: number[] = Array.from(output.data);

    if (embedding.length !== DIMENSIONS[REGULAR_PROVIDERS.LOCAL]) {
      throw new InvalidDimensionsError(
        DIMENSIONS[REGULAR_PROVIDERS.LOCAL],
        embedding.length,
        REGULAR_PROVIDERS.LOCAL
      );
    }

    return embedding;
  } catch (error) {
    if (
      error instanceof ValidationError ||
      error instanceof InvalidDimensionsError
    ) {
      throw error;
    }

    throw new EmbeddingError(
      "Failed to generate embedding",
      "GENERATION_FAILED",
      REGULAR_PROVIDERS.LOCAL,
      error
    );
  }
}

function getDimensions(): number {
  return DIMENSIONS[REGULAR_PROVIDERS.LOCAL];
}

function getName(): string {
  return `${REGULAR_PROVIDERS.LOCAL} (${MODEL_IDS[REGULAR_PROVIDERS.LOCAL]})`;
}

export function createLocalProvider(): EmbeddingProvider {
  return {
    generateEmbedding,
    getDimensions,
    getName,
  };
}

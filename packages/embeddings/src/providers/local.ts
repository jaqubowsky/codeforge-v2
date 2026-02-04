import { pipeline, env as transformersEnv } from "@xenova/transformers";
import { DIMENSIONS, MODEL_IDS, PROVIDERS } from "../constants";
import {
  InvalidDimensionsError,
  ModelLoadError,
  ValidationError,
} from "../errors";
import type { EmbeddingProvider } from "../types";
import { validateInput } from "../validation";

// biome-ignore lint/suspicious/noExplicitAny: Transformers.js pipeline type is complex and not fully exported
type PipelineType = any;

let modelInstance: PipelineType = null;
let modelPromise: Promise<PipelineType> | null = null;

transformersEnv.allowLocalModels = false;
transformersEnv.useBrowserCache = false;

async function initializeModel(): Promise<PipelineType> {
  try {
    const model = await pipeline(
      "feature-extraction",
      MODEL_IDS[PROVIDERS.LOCAL]
    );
    return model;
  } catch (error) {
    throw new ModelLoadError(PROVIDERS.LOCAL, error);
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
      PROVIDERS.LOCAL
    );
  }

  const model = await loadModel();

  try {
    const output = await model(validatedText, {
      pooling: "mean",
      normalize: true,
    });

    const embedding = Array.from(output.data) as number[];

    if (embedding.length !== DIMENSIONS[PROVIDERS.LOCAL]) {
      throw new InvalidDimensionsError(
        DIMENSIONS[PROVIDERS.LOCAL],
        embedding.length,
        PROVIDERS.LOCAL
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

    throw new ModelLoadError(PROVIDERS.LOCAL, error);
  }
}

function getDimensions(): number {
  return DIMENSIONS[PROVIDERS.LOCAL];
}

function getName(): string {
  return `${PROVIDERS.LOCAL} (${MODEL_IDS[PROVIDERS.LOCAL]})`;
}

export function createLocalProvider(): EmbeddingProvider {
  return {
    generateEmbedding,
    getDimensions,
    getName,
  };
}

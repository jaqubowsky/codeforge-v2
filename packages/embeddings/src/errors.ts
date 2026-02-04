export class EmbeddingError extends Error {
  readonly code: string;
  readonly provider: string;
  readonly cause?: unknown;

  constructor(
    message: string,
    code: string,
    provider: string,
    cause?: unknown
  ) {
    super(message);
    this.name = "EmbeddingError";
    this.code = code;
    this.provider = provider;
    this.cause = cause;
  }
}

export const ERROR_CODES = {
  MODEL_LOAD_FAILED: "MODEL_LOAD_FAILED",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  GENERATION_FAILED: "GENERATION_FAILED",
  PROVIDER_NOT_IMPLEMENTED: "PROVIDER_NOT_IMPLEMENTED",
  INVALID_DIMENSIONS: "INVALID_DIMENSIONS",
} as const;

export class ModelLoadError extends EmbeddingError {
  constructor(provider: string, cause?: unknown) {
    super(
      `Failed to load embedding model for provider: ${provider}`,
      ERROR_CODES.MODEL_LOAD_FAILED,
      provider,
      cause
    );
    this.name = "ModelLoadError";
  }
}

export class ValidationError extends EmbeddingError {
  constructor(message: string, provider: string) {
    super(message, ERROR_CODES.VALIDATION_FAILED, provider);
    this.name = "ValidationError";
  }
}

export class ProviderNotImplementedError extends EmbeddingError {
  constructor(provider: string) {
    super(
      `Provider "${provider}" is not implemented yet`,
      ERROR_CODES.PROVIDER_NOT_IMPLEMENTED,
      provider
    );
    this.name = "ProviderNotImplementedError";
  }
}

export class InvalidDimensionsError extends EmbeddingError {
  constructor(expected: number, actual: number, provider: string) {
    super(
      `Invalid embedding dimensions: expected ${expected}, got ${actual}`,
      ERROR_CODES.INVALID_DIMENSIONS,
      provider
    );
    this.name = "InvalidDimensionsError";
  }
}

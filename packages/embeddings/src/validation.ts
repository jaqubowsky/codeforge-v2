import { z } from "zod";
import { INPUT_LIMITS, PROVIDERS } from "./constants";
import type { ProviderType } from "./types";

const embeddingInputSchema = z
  .string()
  .min(INPUT_LIMITS.MIN_LENGTH, "Input text cannot be empty")
  .max(
    INPUT_LIMITS.MAX_LENGTH,
    `Input text cannot exceed ${INPUT_LIMITS.MAX_LENGTH} characters`
  );

const embeddingConfigSchema = z.object({
  provider: z.enum([PROVIDERS.LOCAL, PROVIDERS.OPENAI] as const, {
    message: `Provider must be "${PROVIDERS.LOCAL}" or "${PROVIDERS.OPENAI}"`,
  }),
  modelName: z.string().optional(),
});

export function validateInput(text: string): string {
  const result = embeddingInputSchema.safeParse(text);

  if (!result.success) {
    throw new Error(result.error.issues[0]?.message || "Invalid input");
  }

  return result.data.trim();
}

export function validateConfig(config: unknown): {
  provider: ProviderType;
  modelName?: string;
} {
  const result = embeddingConfigSchema.safeParse(config);

  if (!result.success) {
    throw new Error(result.error.issues[0]?.message || "Invalid configuration");
  }

  return result.data;
}

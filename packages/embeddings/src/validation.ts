import { z } from "zod";
import { INPUT_LIMITS } from "./constants";

const embeddingInputSchema = z
  .string()
  .min(INPUT_LIMITS.MIN_LENGTH, "Input text cannot be empty")
  .max(
    INPUT_LIMITS.MAX_LENGTH,
    `Input text cannot exceed ${INPUT_LIMITS.MAX_LENGTH} characters`
  );

export function validateInput(text: string): string {
  const result = embeddingInputSchema.safeParse(text);

  if (!result.success) {
    throw new Error(result.error.issues[0]?.message || "Invalid input");
  }

  return result.data.trim();
}

import type { ZodError } from "zod";

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown error";
}

export function getErrorMessageFromZodError(error: ZodError): string {
  return error.issues.map((issue) => issue.message).join(", ");
}

export class ScraperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScraperError";
  }
}

export class BadRequestError extends ScraperError {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class ValidationError extends ScraperError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends ScraperError {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class FetchError extends ScraperError {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "FetchError";
    this.status = status;
  }
}

export const isScraperError = (error: unknown): error is ScraperError => {
  return error instanceof ScraperError;
};

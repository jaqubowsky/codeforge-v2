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

class ScraperError extends Error {
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

export class NotFoundError extends ScraperError {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

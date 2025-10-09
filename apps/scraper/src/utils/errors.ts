import type { ZodError } from "zod";
import type { STATUS_CODES } from "./responses";

type ErrorCode = keyof typeof STATUS_CODES;

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

export class CustomError extends Error {
  readonly code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string) {
    super(message, "INTERNAL_SERVER_ERROR");
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, "BAD_REQUEST");
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, "NOT_FOUND");
  }
}

export const isCustomError = (error: unknown): error is CustomError => {
  return error instanceof CustomError;
};

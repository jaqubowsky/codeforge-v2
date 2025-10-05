import z, { type ZodError } from "zod";
import { STATUS_CODES } from "./responses";

type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];
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

export class CustomError extends Error {
  statusCode: StatusCode;
  code: ErrorCode;

  constructor(message: string, statusCode: StatusCode, code: ErrorCode) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string) {
    super(message, STATUS_CODES.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR");
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, STATUS_CODES.BAD_REQUEST, "BAD_REQUEST");
  }
}

export class ValidationError extends CustomError {
  constructor(message: ZodError<unknown>) {
    super(
      z.prettifyError(message),
      STATUS_CODES.BAD_REQUEST,
      "VALIDATION_ERROR"
    );
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, STATUS_CODES.NOT_FOUND, "NOT_FOUND");
  }
}

export const isCustomError = (error: unknown): error is CustomError => {
  return error instanceof CustomError;
};

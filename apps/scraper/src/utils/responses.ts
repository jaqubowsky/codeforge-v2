// biome-ignore-all lint/suspicious/noConsole: observability

import type {
  HttpFunction,
  Request,
  Response,
} from "@google-cloud/functions-framework";
import { getErrorMessage, isCustomError } from "./errors";

export const STATUS_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
} as const;

type ErrorCode = keyof typeof STATUS_CODES;

type SuccessResponseData<T = unknown> = {
  message?: string;
  data: T;
};

type ErrorResponseData = {
  message: string;
  code: ErrorCode;
};

export const successResponse = <T>(
  res: Response,
  data: SuccessResponseData<T>
) => {
  return res.status(STATUS_CODES.SUCCESS).json(data);
};

export const errorResponse = (res: Response, data: ErrorResponseData) => {
  return res.status(STATUS_CODES[data.code]).json(data);
};

export const withError = (fn: HttpFunction) => {
  return async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      console.error("Request failed:", {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        url: req.url,
        body: req.body,
      });

      if (isCustomError(error)) {
        return errorResponse(res, {
          message: getErrorMessage(error),
          code: error.code,
        });
      }

      return errorResponse(res, {
        message: "An unexpected error occurred",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  };
};

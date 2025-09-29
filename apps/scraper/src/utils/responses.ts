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

type SuccessResponseData<T = unknown> = {
  message?: string;
  data: T;
};

export const successResponse = <T>(
  res: Response,
  data: SuccessResponseData<T>
) => {
  return res.status(STATUS_CODES.SUCCESS).json({ data });
};

export const withError = (fn: HttpFunction) => {
  return async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      if (res.headersSent) {
        return;
      }

      if (isCustomError(error)) {
        return res.status(error.statusCode).json({
          error: getErrorMessage(error),
          statusCode: error.statusCode,
          code: error.code,
        });
      }

      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: getErrorMessage(error),
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  };
};

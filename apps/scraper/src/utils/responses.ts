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

type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];
type ErrorCode = keyof typeof STATUS_CODES;

type SuccessResponseData<T = unknown> = {
  message?: string;
  data: T;
};

type ErrorResponseData = {
  message: string;
  statusCode: StatusCode;
  code: ErrorCode;
};

export const successResponse = <T>(
  res: Response,
  data: SuccessResponseData<T>
) => {
  return res.status(STATUS_CODES.SUCCESS).json({ data });
};

export const errorResponse = (res: Response, data: ErrorResponseData) => {
  return res.status(data.statusCode).json(data);
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
        return errorResponse(res, {
          message: getErrorMessage(error),
          statusCode: error.statusCode,
          code: error.code,
        });
      }

      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: getErrorMessage(error),
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  };
};

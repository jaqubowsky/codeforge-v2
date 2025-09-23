import type { ZodError } from "zod";
import { STATUS_CODES } from "./responses";
type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];
type ErrorCode = keyof typeof STATUS_CODES;
export declare function getErrorMessage(error: unknown): string;
export declare class CustomError extends Error {
    statusCode: StatusCode;
    code: ErrorCode;
    constructor(message: string, statusCode: StatusCode, code: ErrorCode);
}
export declare class InternalServerError extends CustomError {
    constructor(message: string);
}
export declare class BadRequestError extends CustomError {
    constructor(message: string);
}
export declare class ValidationError extends CustomError {
    constructor(message: ZodError<unknown>);
}
export declare class NotFoundError extends CustomError {
    constructor(message: string);
}
export declare const isCustomError: (error: unknown) => error is CustomError;
export {};
//# sourceMappingURL=errors.d.ts.map
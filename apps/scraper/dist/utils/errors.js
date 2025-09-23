"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCustomError = exports.NotFoundError = exports.ValidationError = exports.BadRequestError = exports.InternalServerError = exports.CustomError = void 0;
exports.getErrorMessage = getErrorMessage;
const mini_1 = __importDefault(require("zod/mini"));
const responses_1 = require("./responses");
function getErrorMessage(error) {
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
class CustomError extends Error {
    statusCode;
    code;
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}
exports.CustomError = CustomError;
class InternalServerError extends CustomError {
    constructor(message) {
        super(message, responses_1.STATUS_CODES.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR");
    }
}
exports.InternalServerError = InternalServerError;
class BadRequestError extends CustomError {
    constructor(message) {
        super(message, responses_1.STATUS_CODES.BAD_REQUEST, "BAD_REQUEST");
    }
}
exports.BadRequestError = BadRequestError;
class ValidationError extends CustomError {
    constructor(message) {
        super(mini_1.default.prettifyError(message), responses_1.STATUS_CODES.BAD_REQUEST, "VALIDATION_ERROR");
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends CustomError {
    constructor(message) {
        super(message, responses_1.STATUS_CODES.NOT_FOUND, "NOT_FOUND");
    }
}
exports.NotFoundError = NotFoundError;
const isCustomError = (error) => {
    return error instanceof CustomError;
};
exports.isCustomError = isCustomError;

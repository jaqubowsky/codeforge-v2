"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseError = exports.ExposedError = void 0;
const statuses_1 = require("../statuses");
class ExposedError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.ExposedError = ExposedError;
const parseError = (error) => {
    if (error instanceof ExposedError) {
        return {
            error: "Exposed error",
            message: error.message,
            statusCode: error.statusCode,
        };
    }
    return {
        error: "Internal server error",
        message: "Unknown error",
        statusCode: statuses_1.STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
};
exports.parseError = parseError;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withError = exports.successResponse = exports.STATUS_CODES = void 0;
const errors_1 = require("./errors");
exports.STATUS_CODES = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    VALIDATION_ERROR: 422,
    INTERNAL_SERVER_ERROR: 500,
    NOT_FOUND: 404,
};
const successResponse = (res, data) => {
    return res.status(exports.STATUS_CODES.SUCCESS).json(data);
};
exports.successResponse = successResponse;
const withError = (fn) => {
    return async (req, res) => {
        try {
            await fn(req, res);
        }
        catch (error) {
            if (res.headersSent) {
                return;
            }
            if ((0, errors_1.isCustomError)(error)) {
                return res.status(error.statusCode).json({
                    error: (0, errors_1.getErrorMessage)(error),
                    statusCode: error.statusCode,
                    code: error.code,
                });
            }
            return res.status(exports.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                error: (0, errors_1.getErrorMessage)(error),
                statusCode: exports.STATUS_CODES.INTERNAL_SERVER_ERROR,
                code: "INTERNAL_SERVER_ERROR",
            });
        }
    };
};
exports.withError = withError;

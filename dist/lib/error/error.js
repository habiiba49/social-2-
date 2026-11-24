"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    isOperatioinal;
    constructor(message, statusCode, isOperatioinal = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperatioinal = isOperatioinal;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;

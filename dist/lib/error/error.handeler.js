"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandeler = globalErrorHandeler;
const zod_1 = require("zod");
const error_1 = require("./error");
function globalErrorHandeler(err, req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: "validation failed",
            success: false,
            errors: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        });
    }
    if (err instanceof error_1.AppError && err.isOperatioinal) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: false,
        });
    }
    console.error(err);
    return res.status(500).json({
        message: 'something went wrong',
        success: false,
    });
}

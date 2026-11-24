
import { NextFunction, Request, Response } from 'express';
import { ZodError } from "zod";
import { AppError } from "./error";

export function globalErrorHandeler(err: Error | AppError, req: Request, res: Response, _next: NextFunction) {
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "validation failed",
            success: false,
            errors: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        });
    }

    if (err instanceof AppError && err.isOperatioinal) {
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = authGuard;
const error_1 = require("../error/error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function authGuard(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            throw new error_1.AppError("no token provided", 401);
        }
        const token = header.slice(7).trim();
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwt.secret);
        const id = payload.id ?? payload.sub;
        if (!id)
            throw new error_1.AppError("invalid token payload", 401);
        req.user = { ...payload, id: String(id) };
        next();
    }
    catch (error) {
        next(error instanceof error_1.AppError ? error : new error_1.AppError("invalid or expired token", 401));
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.googleLoginSchema = exports.verifyAccountSchema = exports.sendOtpSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const email = zod_1.z.email("invalid email").transform((v) => v.trim().toLowerCase());
exports.registerSchema = zod_1.z.object({
    userName: zod_1.z.string().trim().min(2).max(20),
    email,
    password: zod_1.z.string().min(8, "password must be at least 8 characters").max(64),
    phoneNumber: zod_1.z.string().trim().optional(),
    DOB: zod_1.z.coerce.date().optional(),
    gender: zod_1.z.number().int().min(0).max(1).optional(),
});
exports.loginSchema = zod_1.z.object({
    email,
    password: zod_1.z.string().min(1, "password is required"),
});
exports.sendOtpSchema = zod_1.z.object({ email });
exports.verifyAccountSchema = zod_1.z.object({
    email,
    code: zod_1.z.string().trim().length(6, "code must be 6 digits"),
});
exports.googleLoginSchema = zod_1.z.object({ idToken: zod_1.z.string().min(1) });
exports.refreshTokenSchema = zod_1.z.object({ refreshToken: zod_1.z.string().min(1) });

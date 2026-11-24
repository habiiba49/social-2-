import { z } from "zod";

const email = z.email("invalid email").transform((v) => v.trim().toLowerCase());

export const registerSchema = z.object({
    userName: z.string().trim().min(2).max(20),
    email,
    password: z.string().min(8, "password must be at least 8 characters").max(64),
    phoneNumber: z.string().trim().optional(),
    DOB: z.coerce.date().optional(),
    gender: z.number().int().min(0).max(1).optional(),
});

export const loginSchema = z.object({
    email,
    password: z.string().min(1, "password is required"),
});

export const sendOtpSchema = z.object({ email });

export const verifyAccountSchema = z.object({
    email,
    code: z.string().trim().length(6, "code must be 6 digits"),
});

export const googleLoginSchema = z.object({ idToken: z.string().min(1) });

export const refreshTokenSchema = z.object({ refreshToken: z.string().min(1) });

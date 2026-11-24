"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.setCookies = setCookies;
exports.sanitizeUser = sanitizeUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
const env_1 = require("../../lib/config/env");
const time_1 = require("../../pkg/utils/time");
async function hashPassword(password) {
    return argon2_1.default.hash(password);
}
async function comparePassword(password, hashedPassword) {
    return argon2_1.default.verify(hashedPassword, password);
}
function generateAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwt.secret, { expiresIn: (0, time_1.toSeconds)(1, "hours") });
}
function generateRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwt.refreshSecret, { expiresIn: (0, time_1.toSeconds)(7 * 24, "hours") });
}
function setCookies(res, accessToken, refreshToken) {
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: (0, time_1.toMs)(1, 'hours')
    });
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: (0, time_1.toMs)(7, 'hours'),
        path: '/api/auth/refresh-token'
    });
}
function sanitizeUser(user) {
    const obj = typeof user?.toObject === "function" ? user.toObject() : { ...user };
    delete obj.password;
    delete obj.__v;
    return obj;
}

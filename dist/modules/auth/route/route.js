"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const tokens_1 = require("../../../lib/di/tokens");
const container_1 = __importDefault(require("../../../lib/di/container"));
exports.authRouter = (0, express_1.Router)();
const authController = container_1.default.resolve(tokens_1.TOKENS.AuthController);
exports.authRouter.post('/register', authController.register);
exports.authRouter.post('/verify-account', authController.verifyAccount);
exports.authRouter.post('/send-otp', authController.sendOtp);
exports.authRouter.post('/login', authController.login);
exports.authRouter.post('/refresh-token', authController.refreshToken);
exports.authRouter.post('/login-with-google', authController.loginWithGoogle);

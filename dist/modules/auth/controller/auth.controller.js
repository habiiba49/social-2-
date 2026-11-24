"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../service/auth.service");
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
const auth_validation_1 = require("../auth.validation");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register = async (req, res, next) => {
        try {
            const user = await this.authService.register(auth_validation_1.registerSchema.parse(req.body));
            return res.status(201).json({
                message: "created successfully, please verify your email",
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    };
    verifyAccount = async (req, res, next) => {
        try {
            const user = await this.authService.verfyAccount(auth_validation_1.verifyAccountSchema.parse(req.body));
            return res.status(200).json({
                message: "account verified successfully",
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    };
    sendOtp = async (req, res, next) => {
        try {
            await this.authService.sendOtp(auth_validation_1.sendOtpSchema.parse(req.body));
            return res.status(200).json({ message: "otp sent successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const tokens = await this.authService.login(auth_validation_1.loginSchema.parse(req.body));
            return res.status(200).json({ message: "logged in successfully", success: true, data: tokens });
        }
        catch (error) {
            next(error);
        }
    };
    loginWithGoogle = async (req, res, next) => {
        try {
            const { idToken } = auth_validation_1.googleLoginSchema.parse(req.body);
            const tokens = await this.authService.loginWithGoogle(idToken);
            return res.status(200).json({ message: "logged in with google successfully", success: true, data: tokens });
        }
        catch (error) {
            next(error);
        }
    };
    refreshToken = async (req, res, next) => {
        try {
            const { refreshToken } = auth_validation_1.refreshTokenSchema.parse(req.body);
            const tokens = await this.authService.refreshTokenFn(refreshToken);
            return res.status(200).json({ message: "token refreshed successfully", success: true, data: tokens });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.AuthService)),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);

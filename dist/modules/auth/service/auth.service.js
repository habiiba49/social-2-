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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const error_1 = require("../../../lib/error/error");
const utlis_1 = require("../utlis");
const init_1 = require("../../../lib/cache/init");
const time_1 = require("../../../pkg/utils/time");
const user_repo_1 = require("../../user/repo/user.repo");
const otp_utils_1 = require("../../../lib/utils/otp.utils");
const google_auth_1 = require("../../../lib/utils/google.auth");
const enum_1 = require("../../../lib/enum");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../../lib/config/env");
const tokens_1 = require("../../../lib/di/tokens");
const tsyringe_1 = require("tsyringe");
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_SECONDS = (0, time_1.toSeconds)(15, 'minutes');
const OTP_TTL_SECONDS = (0, time_1.toSeconds)(3, 'minutes');
let AuthService = class AuthService {
    userRepository;
    mailProvider;
    verifyOtpKey = 'otp:verify:';
    loginAttemptsKey = 'login-attempts:';
    constructor(userRepository, mailProvider) {
        this.userRepository = userRepository;
        this.mailProvider = mailProvider;
    }
    buildTokens = (user) => {
        const payload = { id: user._id.toString(), email: user.email };
        return {
            accessToken: (0, utlis_1.generateAccessToken)(payload),
            refreshToken: (0, utlis_1.generateRefreshToken)(payload),
        };
    };
    sendVerificationOtp = async (userId, email) => {
        const otp = (0, otp_utils_1.generateOTPCode)();
        await init_1.cacheProvider.set(`${this.verifyOtpKey}${userId}`, otp, OTP_TTL_SECONDS);
        try {
            await this.mailProvider.SendMail(email, 'Verification code', `<h1>Your verification code is ${otp}</h1>`);
        }
        catch (error) {
            console.error('failed to send verification email', error);
            throw new error_1.AppError("could not send verification email, please try again", 502);
        }
    };
    register = async (registerDto) => {
        const userExist = await this.userRepository.findbyEmail(registerDto.email);
        if (userExist)
            throw new error_1.AppError("user already exists", 409);
        const password = await (0, utlis_1.hashPassword)(registerDto.password);
        const createdUser = await this.userRepository.create({
            ...registerDto,
            password,
            provider: enum_1.Provider.LOCAL,
            isVerified: false,
        });
        await this.sendVerificationOtp(createdUser._id.toString(), createdUser.email);
        return (0, utlis_1.sanitizeUser)(createdUser);
    };
    verfyAccount = async (dto) => {
        const user = await this.userRepository.findbyEmail(dto.email);
        if (!user)
            throw new error_1.AppError("user not found", 404);
        if (user.isVerified)
            throw new error_1.AppError("account is already verified", 400);
        const key = `${this.verifyOtpKey}${user._id.toString()}`;
        const cachedCode = await init_1.cacheProvider.get(key);
        if (!cachedCode)
            throw new error_1.AppError("otp is expired", 403);
        if (cachedCode !== dto.code)
            throw new error_1.AppError("invalid code", 400);
        const updatedUser = await this.userRepository.update({ _id: user._id }, { isVerified: true });
        await init_1.cacheProvider.del(key);
        return (0, utlis_1.sanitizeUser)(updatedUser);
    };
    // resend the verification otp
    sendOtp = async (dto) => {
        const user = await this.userRepository.findbyEmail(dto.email);
        if (!user)
            throw new error_1.AppError("user not found", 404);
        if (user.isVerified)
            throw new error_1.AppError("account is already verified", 400);
        await this.sendVerificationOtp(user._id.toString(), user.email);
    };
    login = async (dto) => {
        const attemptsKey = `${this.loginAttemptsKey}${dto.email}`;
        const attempts = Number((await init_1.cacheProvider.get(attemptsKey)) ?? 0);
        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            throw new error_1.AppError("too many failed attempts, please try again later", 429);
        }
        const user = await this.userRepository.findbyEmail(dto.email);
        const invalid = () => new error_1.AppError("invalid email or password", 401);
        if (!user || !user.password) {
            // unknown email, or a google-only account without a password
            throw invalid();
        }
        const match = await (0, utlis_1.comparePassword)(dto.password, user.password);
        if (!match) {
            const ttl = await init_1.cacheProvider.ttl(attemptsKey);
            await init_1.cacheProvider.set(attemptsKey, String(attempts + 1), ttl > 0 ? ttl : LOGIN_LOCK_SECONDS);
            throw invalid();
        }
        if (!user.isVerified)
            throw new error_1.AppError("please verify your account first", 403);
        await init_1.cacheProvider.del(attemptsKey);
        return this.buildTokens(user);
    };
    loginWithGoogle = async (idToken) => {
        const payload = await (0, google_auth_1.verifiyGoogleToken)(idToken);
        if (!payload || !payload.email)
            throw new error_1.AppError('no payload provided', 400);
        if (payload.email_verified === false)
            throw new error_1.AppError('google email is not verified', 403);
        let user = await this.userRepository.findbyEmail(payload.email);
        if (!user) {
            user = await this.userRepository.create({
                userName: (payload.name ?? payload.email.split('@')[0]).slice(0, 20),
                email: payload.email,
                provider: enum_1.Provider.GOOGLE,
                isVerified: true,
            });
        }
        return this.buildTokens(user);
    };
    refreshTokenFn = async (token) => {
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(token, env_1.env.jwt.refreshSecret);
        }
        catch {
            throw new error_1.AppError("invalid or expired refresh token", 401);
        }
        const user = await this.userRepository.getById(String(payload.id));
        if (!user)
            throw new error_1.AppError("user not found", 404);
        return this.buildTokens(user);
    };
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.UserRepo)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.NodemailerProvider)),
    __metadata("design:paramtypes", [user_repo_1.UserRepo, Object])
], AuthService);


import { LoginDto, SendOtpDto, VerfyAccountDto, RegisterDto } from "../dto/auth.dto";
import { AppError } from "../../../lib/error/error";
import { comparePassword, hashPassword, generateAccessToken, generateRefreshToken, sanitizeUser } from "../utlis";
import { cacheProvider } from "../../../lib/cache/init";
import { toSeconds } from "../../../pkg/utils/time";
import { UserRepo } from "../../user/repo/user.repo";
import { MailProvider } from "../../../pkg/notification/mail.interface";
import { generateOTPCode } from "../../../lib/utils/otp.utils";
import { verifiyGoogleToken } from "../../../lib/utils/google.auth";
import { Provider } from "../../../lib/enum";
import jwt from "jsonwebtoken";
import { env } from "../../../lib/config/env";
import { TOKENS } from "../../../lib/di/tokens";
import { inject, injectable } from "tsyringe";

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_SECONDS = toSeconds(15, 'minutes');
const OTP_TTL_SECONDS = toSeconds(3, 'minutes');



@injectable()
export class AuthService {
    private verifyOtpKey = 'otp:verify:';
    private loginAttemptsKey = 'login-attempts:';

    constructor(
        @inject(TOKENS.UserRepo) private readonly userRepository: UserRepo,
        @inject(TOKENS.NodemailerProvider) private readonly mailProvider: MailProvider
    ) {}

    private buildTokens = (user: { _id: any; email: string }) => {
        const payload = { id: user._id.toString(), email: user.email };
        return {
            accessToken: generateAccessToken(payload),
            refreshToken: generateRefreshToken(payload),
        };
    };

    private sendVerificationOtp = async (userId: string, email: string) => {
        const otp = generateOTPCode();
        await cacheProvider.set(`${this.verifyOtpKey}${userId}`, otp, OTP_TTL_SECONDS);
        try {
            await this.mailProvider.SendMail(email, 'Verification code', `<h1>Your verification code is ${otp}</h1>`);
        } catch (error) {
            console.error('failed to send verification email', error);
            throw new AppError("could not send verification email, please try again", 502);
        }
    };

    register = async (registerDto: RegisterDto) => {
        const userExist = await this.userRepository.findbyEmail(registerDto.email);
        if (userExist) throw new AppError("user already exists", 409);

        const password = await hashPassword(registerDto.password);
        const createdUser = await this.userRepository.create({
            ...registerDto,
            password,
            provider: Provider.LOCAL,
            isVerified: false,
        });

        await this.sendVerificationOtp(createdUser._id.toString(), createdUser.email);
        return sanitizeUser(createdUser);
    };

    verfyAccount = async (dto: VerfyAccountDto) => {
        const user = await this.userRepository.findbyEmail(dto.email);
        if (!user) throw new AppError("user not found", 404);
        if (user.isVerified) throw new AppError("account is already verified", 400);

        const key = `${this.verifyOtpKey}${user._id.toString()}`;
        const cachedCode = await cacheProvider.get(key);
        if (!cachedCode) throw new AppError("otp is expired", 403);
        if (cachedCode !== dto.code) throw new AppError("invalid code", 400);

        const updatedUser = await this.userRepository.update({ _id: user._id }, { isVerified: true });
        await cacheProvider.del(key);
        return sanitizeUser(updatedUser);
    };


    sendOtp = async (dto: SendOtpDto) => {
        const user = await this.userRepository.findbyEmail(dto.email);
        if (!user) throw new AppError("user not found", 404);
        if (user.isVerified) throw new AppError("account is already verified", 400);
        await this.sendVerificationOtp(user._id.toString(), user.email);
    };

    login = async (dto: LoginDto) => {
        const attemptsKey = `${this.loginAttemptsKey}${dto.email}`;
        const attempts = Number((await cacheProvider.get(attemptsKey)) ?? 0);
        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            throw new AppError("too many failed attempts, please try again later", 429);
        }

        const user = await this.userRepository.findbyEmail(dto.email);
        const invalid = () => new AppError("invalid email or password", 401);

        if (!user || !user.password) {
            // unknown email, or a google-only account without a password
            throw invalid();
        }

        const match = await comparePassword(String(dto.password), user.password);
        if (!match) {
            const ttl = await cacheProvider.ttl(attemptsKey);
            await cacheProvider.set(attemptsKey, String(attempts + 1), ttl > 0 ? ttl : LOGIN_LOCK_SECONDS);
            throw invalid();
        }

        if (!user.isVerified) throw new AppError("please verify your account first", 403);

        await cacheProvider.del(attemptsKey);
        return this.buildTokens(user);
    };

    loginWithGoogle = async (idToken: string) => {
        const payload = await verifiyGoogleToken(idToken);
        if (!payload || !payload.email) throw new AppError('no payload provided', 400);
        if (payload.email_verified === false) throw new AppError('google email is not verified', 403);

        let user = await this.userRepository.findbyEmail(payload.email);
        if (!user) {
            user = await this.userRepository.create({
                userName: (payload.name ?? payload.email.split('@')[0]).slice(0, 20),
                email: payload.email,
                provider: Provider.GOOGLE,
                isVerified: true,
            });
        }
        return this.buildTokens(user);
    };

    refreshTokenFn = async (token: string) => {
        let payload: any;
        try {
            payload = jwt.verify(token, env.jwt.refreshSecret);
        } catch {
            throw new AppError("invalid or expired refresh token", 401);
        }
        const user = await this.userRepository.getById(String(payload.id));
        if (!user) throw new AppError("user not found", 404);
        return this.buildTokens(user);
    };
}
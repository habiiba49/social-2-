import { NextFunction, Request, Response } from "express";
import { AuthService } from "../service/auth.service";
import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens";
import {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyAccountSchema,
  googleLoginSchema,
  refreshTokenSchema,
} from "../auth.validation";

import { RegisterDto } from "../dto/auth.dto";

@injectable()
export class AuthController {
  constructor(@inject(TOKENS.AuthService) private readonly authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.register(registerSchema.parse(req.body) as RegisterDto)
      return res.status(201).json({
        message: "created successfully, please verify your email",
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.verfyAccount(verifyAccountSchema.parse(req.body));
      return res.status(200).json({
        message: "account verified successfully",
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.sendOtp(sendOtpSchema.parse(req.body));
      return res.status(200).json({ message: "otp sent successfully", success: true });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens = await this.authService.login(loginSchema.parse(req.body));
      return res.status(200).json({ message: "logged in successfully", success: true, data: tokens });
    } catch (error) {
      next(error);
    }
  };

  loginWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idToken } = googleLoginSchema.parse(req.body);
      const tokens = await this.authService.loginWithGoogle(idToken);
      return res.status(200).json({ message: "logged in with google successfully", success: true, data: tokens });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = refreshTokenSchema.parse(req.body);
      const tokens = await this.authService.refreshTokenFn(refreshToken);
      return res.status(200).json({ message: "token refreshed successfully", success: true, data: tokens });
    } catch (error) {
      next(error);
    }
  };
}

import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { TOKENS } from "../../../lib/di/tokens";
import container from "../../../lib/di/container";

export const authRouter = Router();

const authController = container.resolve<AuthController>(TOKENS.AuthController);

authRouter.post('/register', authController.register);
authRouter.post('/verify-account', authController.verifyAccount);
authRouter.post('/send-otp', authController.sendOtp);
authRouter.post('/login', authController.login);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.post('/login-with-google', authController.loginWithGoogle);
import { AppError } from "../error/error";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { NextFunction, Request, Response } from "express";

export interface JwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  id: string;
}

export function authGuard(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("no token provided", 401);
    }
    const token = header.slice(7).trim();
    const payload = jwt.verify(token, env.jwt.secret) as any;
    const id = payload.id ?? payload.sub;
    if (!id) throw new AppError("invalid token payload", 401);
    req.user = { ...payload, id: String(id) };
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError("invalid or expired token", 401));
  }
}
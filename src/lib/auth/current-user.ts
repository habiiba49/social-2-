import { Request } from "express";
import { AppError } from "../error/error";

export function getUserId(req: Request): string {
  const id = req.user?.id;
  if (!id) throw new AppError("unauthorized", 401);
  return id;
}

import { Types } from "mongoose";
import { z } from "zod";

export const objectIdSchema = z
  .string()
  .refine((v) => Types.ObjectId.isValid(v), { message: "invalid id" });

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

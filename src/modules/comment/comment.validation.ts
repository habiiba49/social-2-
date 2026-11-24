import { z } from "zod";

export const createCommentSchema = z.object({
    content: z.string().trim().min(1, "content is required").max(2000),
});

export const updateCommentSchema = z.object({
    content: z.string().trim().min(1, "content is required").max(2000),
});

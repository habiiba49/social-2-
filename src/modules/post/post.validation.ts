import { z } from "zod";

export const createPostSchema = z.object({
    content: z.string().trim().min(1, "content is required").max(5000),
});

export const updatePostSchema = z.object({
    content: z.string().trim().min(1, "content is required").max(5000),
});

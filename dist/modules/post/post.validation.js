"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    content: zod_1.z.string().trim().min(1, "content is required").max(5000),
});
exports.updatePostSchema = zod_1.z.object({
    content: zod_1.z.string().trim().min(1, "content is required").max(5000),
});

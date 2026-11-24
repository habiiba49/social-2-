"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentSchema = exports.createCommentSchema = void 0;
const zod_1 = require("zod");
exports.createCommentSchema = zod_1.z.object({
    content: zod_1.z.string().trim().min(1, "content is required").max(2000),
});
exports.updateCommentSchema = zod_1.z.object({
    content: zod_1.z.string().trim().min(1, "content is required").max(2000),
});

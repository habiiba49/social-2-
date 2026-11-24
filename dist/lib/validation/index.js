"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.objectIdSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.objectIdSchema = zod_1.z
    .string()
    .refine((v) => mongoose_1.Types.ObjectId.isValid(v), { message: "invalid id" });
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});

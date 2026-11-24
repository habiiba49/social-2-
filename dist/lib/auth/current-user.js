"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = getUserId;
const error_1 = require("../error/error");
function getUserId(req) {
    const id = req.user?.id;
    if (!id)
        throw new error_1.AppError("unauthorized", 401);
    return id;
}

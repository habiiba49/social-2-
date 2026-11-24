"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const multer_1 = require("../../../lib/media/multer");
const container_1 = __importDefault(require("../../../lib/di/container"));
const tokens_1 = require("../../../lib/di/tokens");
exports.userRouter = (0, express_1.Router)();
const userController = container_1.default.resolve(tokens_1.TOKENS.UserController);
exports.userRouter.post('/upload-profile-pic', (0, multer_1.multerUploadSingle)('pp'), userController.uploadProfilePicture);
exports.userRouter.delete('/delete-profile-pic', userController.deleteProfilePic);
exports.userRouter.post('/get-presigned-url', userController.genaratePresignedUrl);

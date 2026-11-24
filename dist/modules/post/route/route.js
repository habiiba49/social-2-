"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const container_1 = __importDefault(require("../../../lib/di/container"));
const tokens_1 = require("../../../lib/di/tokens");
const route_1 = require("../../comment/route/route");
exports.postRouter = (0, express_1.Router)();
const postController = container_1.default.resolve(tokens_1.TOKENS.PostController);
exports.postRouter.post('/', postController.create);
exports.postRouter.get('/', postController.getMyPosts);
exports.postRouter.get('/:id', postController.getById);
exports.postRouter.patch('/:id', postController.update);
exports.postRouter.delete('/:id', postController.delete);
exports.postRouter.use('/:postId/comments', route_1.postCommentsRouter);

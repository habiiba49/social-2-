"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = exports.postCommentsRouter = void 0;
const express_1 = require("express");
const container_1 = __importDefault(require("../../../lib/di/container"));
const tokens_1 = require("../../../lib/di/tokens");
const commentController = container_1.default.resolve(tokens_1.TOKENS.CommentController);
// mounted at /api/posts/:postId/comments
exports.postCommentsRouter = (0, express_1.Router)({ mergeParams: true });
exports.postCommentsRouter.post('/', commentController.create);
exports.postCommentsRouter.get('/', commentController.getPostComments);
// mounted at /api/comments
exports.commentRouter = (0, express_1.Router)();
exports.commentRouter.get('/:id', commentController.getById);
exports.commentRouter.patch('/:id', commentController.update);
exports.commentRouter.delete('/:id', commentController.delete);

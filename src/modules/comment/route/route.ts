import { Router } from "express";
import container from "../../../lib/di/container";
import { TOKENS } from "../../../lib/di/tokens";
import { CommentController } from "../controller/comment.controller";

const commentController = container.resolve<CommentController>(TOKENS.CommentController);

// mounted at /api/posts/:postId/comments
export const postCommentsRouter: Router = Router({ mergeParams: true });
postCommentsRouter.post('/', commentController.create);
postCommentsRouter.get('/', commentController.getPostComments);

// mounted at /api/comments
export const commentRouter: Router = Router();
commentRouter.get('/:id', commentController.getById);
commentRouter.patch('/:id', commentController.update);
commentRouter.delete('/:id', commentController.delete);
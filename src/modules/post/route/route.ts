import { Router } from "express";
import container from "../../../lib/di/container";
import { TOKENS } from "../../../lib/di/tokens";
import { PostController } from "../controller/post.controller";
import { postCommentsRouter } from "../../comment/route/route";

export const postRouter: Router = Router();

const postController = container.resolve<PostController>(TOKENS.PostController);

postRouter.post('/', postController.create);
postRouter.get('/', postController.getMyPosts);
postRouter.get('/:id', postController.getById);
postRouter.patch('/:id', postController.update);
postRouter.delete('/:id', postController.delete);


postRouter.use('/:postId/comments', postCommentsRouter);
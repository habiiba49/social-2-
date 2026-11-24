import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens";
import { getUserId } from "../../../lib/auth/current-user";
import { objectIdSchema, paginationSchema } from "../../../lib/validation";
import { PostService } from "../service/post.service";
import { createPostSchema, updatePostSchema } from "../post.validation";

@injectable()
export class PostController {
    constructor(@inject(TOKENS.PostService) private readonly postService: PostService) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = createPostSchema.parse(req.body);
            const post = await this.postService.create(getUserId(req), dto);
            return res.status(201).json({ message: "post created successfully", success: true, data: post });
        } catch (error) {
            next(error);
        }
    };

    getMyPosts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = paginationSchema.parse(req.query);
            const posts = await this.postService.getMyPosts(getUserId(req), page, limit);
            return res.status(200).json({ message: "posts retrieved successfully", success: true, data: posts });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = objectIdSchema.parse(req.params.id);
            const post = await this.postService.getById(id);
            return res.status(200).json({ message: "post retrieved successfully", success: true, data: post });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = objectIdSchema.parse(req.params.id);
            const dto = updatePostSchema.parse(req.body);
            const post = await this.postService.update(getUserId(req), id, dto);
            return res.status(200).json({ message: "post updated successfully", success: true, data: post });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = objectIdSchema.parse(req.params.id);
            await this.postService.delete(getUserId(req), id);
            return res.status(200).json({ message: "post deleted successfully", success: true });
        } catch (error) {
            next(error);
        }
    };
}
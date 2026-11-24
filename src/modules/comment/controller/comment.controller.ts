import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens";
import { getUserId } from "../../../lib/auth/current-user";
import { objectIdSchema, paginationSchema } from "../../../lib/validation";
import { CommentService } from "../service/comment.service";
import { createCommentSchema, updateCommentSchema } from "../comment.validation";

@injectable()
export class CommentController {
    constructor(@inject(TOKENS.CommentService) private readonly commentService: CommentService) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postId = objectIdSchema.parse(req.params.postId);
            const dto = createCommentSchema.parse(req.body);
            const comment = await this.commentService.create(getUserId(req), postId, dto);
            return res.status(201).json({ message: "comment created successfully", success: true, data: comment });
        } catch (error) {
            next(error);
        }
    };

    getPostComments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postId = objectIdSchema.parse(req.params.postId);
            const { page, limit } = paginationSchema.parse(req.query);
            const comments = await this.commentService.getPostComments(postId, page, limit);
            return res.status(200).json({ message: "comments retrieved successfully", success: true, data: comments });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = objectIdSchema.parse(req.params.id);
            const comment = await this.commentService.getById(id);
            return res.status(200).json({ message: "comment retrieved successfully", success: true, data: comment });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = objectIdSchema.parse(req.params.id);
            const dto = updateCommentSchema.parse(req.body);
            const comment = await this.commentService.update(getUserId(req), id, dto);
            return res.status(200).json({ message: "comment updated successfully", success: true, data: comment });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = objectIdSchema.parse(req.params.id);
            await this.commentService.delete(getUserId(req), id);
            return res.status(200).json({ message: "comment deleted successfully", success: true });
        } catch (error) {
            next(error);
        }
    };
}
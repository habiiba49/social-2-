import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens";
import { AppError } from "../../../lib/error/error";
import { CommentRepo } from "../repo/comment.repo";
import { PostRepo } from "../../post/repo/post.repository";
import { CreateCommentDto, UpdateCommentDto } from "../comment.dto";

@injectable()
export class CommentService {
    constructor(
        @inject(TOKENS.CommentRepo) private readonly commentRepo: CommentRepo,
        @inject(TOKENS.PostRepo) private readonly postRepo: PostRepo
    ) {}

    private ensurePostExists = async (postId: string) => {
        const post = await this.postRepo.getById(postId);
        if (!post) throw new AppError("post not found", 404);
        return post;
    };

    create = async (userId: string, postId: string, dto: CreateCommentDto) => {
        await this.ensurePostExists(postId);
        return this.commentRepo.create({ post: postId, author: userId, content: dto.content });
    };

    getPostComments = async (postId: string, page: number, limit: number) => {
        await this.ensurePostExists(postId);
        return this.commentRepo.find(
            { post: postId },
            { sort: { createdAt: 1 }, skip: (page - 1) * limit, limit }
        );
    };

    getById = async (commentId: string) => {
        const comment = await this.commentRepo.getById(commentId);
        if (!comment) throw new AppError("comment not found", 404);
        return comment;
    };

    update = async (userId: string, commentId: string, dto: UpdateCommentDto) => {
        const comment = await this.getById(commentId);
        if (comment.author.toString() !== userId) {
            throw new AppError("you can only update your own comment", 403);
        }
        return this.commentRepo.update({ _id: commentId }, { content: dto.content });
    };

    delete = async (userId: string, commentId: string) => {
        const comment = await this.getById(commentId);
        const isCommentOwner = comment.author.toString() === userId;
        if (!isCommentOwner) {
            const post = await this.postRepo.getById(comment.post.toString());
            const isPostOwner = post?.author.toString() === userId;
            if (!isPostOwner) {
                throw new AppError("only the comment owner or the post owner can delete this comment", 403);
            }
        }
        await this.commentRepo.delete({ _id: commentId });
    };
}

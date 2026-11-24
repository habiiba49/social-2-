import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens";
import { AppError } from "../../../lib/error/error";
import { PostRepo } from "../repo/post.repository";
import { CommentRepo } from "../../comment/repo/comment.repo";
import { CreatePostDto, UpdatePostDto } from "../post.dto";

@injectable()
export class PostService {
    constructor(
        @inject(TOKENS.PostRepo) private readonly postRepo: PostRepo,
        @inject(TOKENS.CommentRepo) private readonly commentRepo: CommentRepo
    ) {}

    create = async (userId: string, dto: CreatePostDto) => {
        return this.postRepo.create({ author: userId, content: dto.content });
    };

    // posts created by the logged-in user
    getMyPosts = async (userId: string, page: number, limit: number) => {
        return this.postRepo.find(
            { author: userId },
            { sort: { createdAt: -1 }, skip: (page - 1) * limit, limit }
        );
    };

    getById = async (postId: string) => {
        const post = await this.postRepo.getById(postId);
        if (!post) throw new AppError("post not found", 404);
        return post;
    };

    update = async (userId: string, postId: string, dto: UpdatePostDto) => {
        const post = await this.getById(postId);
        if (post.author.toString() !== userId) {
            throw new AppError("you can only update your own post", 403);
        }
        return this.postRepo.update({ _id: postId }, { content: dto.content });
    };

    delete = async (userId: string, postId: string) => {
        const post = await this.getById(postId);
        if (post.author.toString() !== userId) {
            throw new AppError("you can only delete your own post", 403);
        }
        await this.postRepo.delete({ _id: postId });
        await this.commentRepo.deleteMany({ post: postId });
    };
}
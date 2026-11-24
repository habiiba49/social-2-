"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
const error_1 = require("../../../lib/error/error");
const comment_repo_1 = require("../repo/comment.repo");
const post_repository_1 = require("../../post/repo/post.repository");
let CommentService = class CommentService {
    commentRepo;
    postRepo;
    constructor(commentRepo, postRepo) {
        this.commentRepo = commentRepo;
        this.postRepo = postRepo;
    }
    ensurePostExists = async (postId) => {
        const post = await this.postRepo.getById(postId);
        if (!post)
            throw new error_1.AppError("post not found", 404);
        return post;
    };
    create = async (userId, postId, dto) => {
        await this.ensurePostExists(postId);
        return this.commentRepo.create({ post: postId, author: userId, content: dto.content });
    };
    getPostComments = async (postId, page, limit) => {
        await this.ensurePostExists(postId);
        return this.commentRepo.find({ post: postId }, { sort: { createdAt: 1 }, skip: (page - 1) * limit, limit });
    };
    getById = async (commentId) => {
        const comment = await this.commentRepo.getById(commentId);
        if (!comment)
            throw new error_1.AppError("comment not found", 404);
        return comment;
    };
    update = async (userId, commentId, dto) => {
        const comment = await this.getById(commentId);
        if (comment.author.toString() !== userId) {
            throw new error_1.AppError("you can only update your own comment", 403);
        }
        return this.commentRepo.update({ _id: commentId }, { content: dto.content });
    };
    // allowed for the comment owner OR the owner of the post
    delete = async (userId, commentId) => {
        const comment = await this.getById(commentId);
        const isCommentOwner = comment.author.toString() === userId;
        if (!isCommentOwner) {
            const post = await this.postRepo.getById(comment.post.toString());
            const isPostOwner = post?.author.toString() === userId;
            if (!isPostOwner) {
                throw new error_1.AppError("only the comment owner or the post owner can delete this comment", 403);
            }
        }
        await this.commentRepo.delete({ _id: commentId });
    };
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.CommentRepo)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.PostRepo)),
    __metadata("design:paramtypes", [comment_repo_1.CommentRepo, post_repository_1.PostRepo])
], CommentService);

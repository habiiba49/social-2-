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
exports.PostService = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
const error_1 = require("../../../lib/error/error");
const post_repository_1 = require("../repo/post.repository");
const comment_repo_1 = require("../../comment/repo/comment.repo");
let PostService = class PostService {
    postRepo;
    commentRepo;
    constructor(postRepo, commentRepo) {
        this.postRepo = postRepo;
        this.commentRepo = commentRepo;
    }
    create = async (userId, dto) => {
        return this.postRepo.create({ author: userId, content: dto.content });
    };
    // posts created by the logged-in user
    getMyPosts = async (userId, page, limit) => {
        return this.postRepo.find({ author: userId }, { sort: { createdAt: -1 }, skip: (page - 1) * limit, limit });
    };
    getById = async (postId) => {
        const post = await this.postRepo.getById(postId);
        if (!post)
            throw new error_1.AppError("post not found", 404);
        return post;
    };
    update = async (userId, postId, dto) => {
        const post = await this.getById(postId);
        if (post.author.toString() !== userId) {
            throw new error_1.AppError("you can only update your own post", 403);
        }
        return this.postRepo.update({ _id: postId }, { content: dto.content });
    };
    delete = async (userId, postId) => {
        const post = await this.getById(postId);
        if (post.author.toString() !== userId) {
            throw new error_1.AppError("you can only delete your own post", 403);
        }
        await this.postRepo.delete({ _id: postId });
        await this.commentRepo.deleteMany({ post: postId });
    };
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.PostRepo)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.CommentRepo)),
    __metadata("design:paramtypes", [post_repository_1.PostRepo, comment_repo_1.CommentRepo])
], PostService);

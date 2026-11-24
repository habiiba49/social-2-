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
exports.PostController = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
const current_user_1 = require("../../../lib/auth/current-user");
const validation_1 = require("../../../lib/validation");
const post_service_1 = require("../service/post.service");
const post_validation_1 = require("../post.validation");
let PostController = class PostController {
    postService;
    constructor(postService) {
        this.postService = postService;
    }
    create = async (req, res, next) => {
        try {
            const dto = post_validation_1.createPostSchema.parse(req.body);
            const post = await this.postService.create((0, current_user_1.getUserId)(req), dto);
            return res.status(201).json({ message: "post created successfully", success: true, data: post });
        }
        catch (error) {
            next(error);
        }
    };
    getMyPosts = async (req, res, next) => {
        try {
            const { page, limit } = validation_1.paginationSchema.parse(req.query);
            const posts = await this.postService.getMyPosts((0, current_user_1.getUserId)(req), page, limit);
            return res.status(200).json({ message: "posts retrieved successfully", success: true, data: posts });
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = validation_1.objectIdSchema.parse(req.params.id);
            const post = await this.postService.getById(id);
            return res.status(200).json({ message: "post retrieved successfully", success: true, data: post });
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = validation_1.objectIdSchema.parse(req.params.id);
            const dto = post_validation_1.updatePostSchema.parse(req.body);
            const post = await this.postService.update((0, current_user_1.getUserId)(req), id, dto);
            return res.status(200).json({ message: "post updated successfully", success: true, data: post });
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = validation_1.objectIdSchema.parse(req.params.id);
            await this.postService.delete((0, current_user_1.getUserId)(req), id);
            return res.status(200).json({ message: "post deleted successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.PostController = PostController;
exports.PostController = PostController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.PostService)),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostController);

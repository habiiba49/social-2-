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
exports.CommentController = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
const current_user_1 = require("../../../lib/auth/current-user");
const validation_1 = require("../../../lib/validation");
const comment_service_1 = require("../service/comment.service");
const comment_validation_1 = require("../comment.validation");
let CommentController = class CommentController {
    commentService;
    constructor(commentService) {
        this.commentService = commentService;
    }
    create = async (req, res, next) => {
        try {
            const postId = validation_1.objectIdSchema.parse(req.params.postId);
            const dto = comment_validation_1.createCommentSchema.parse(req.body);
            const comment = await this.commentService.create((0, current_user_1.getUserId)(req), postId, dto);
            return res.status(201).json({ message: "comment created successfully", success: true, data: comment });
        }
        catch (error) {
            next(error);
        }
    };
    getPostComments = async (req, res, next) => {
        try {
            const postId = validation_1.objectIdSchema.parse(req.params.postId);
            const { page, limit } = validation_1.paginationSchema.parse(req.query);
            const comments = await this.commentService.getPostComments(postId, page, limit);
            return res.status(200).json({ message: "comments retrieved successfully", success: true, data: comments });
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = validation_1.objectIdSchema.parse(req.params.id);
            const comment = await this.commentService.getById(id);
            return res.status(200).json({ message: "comment retrieved successfully", success: true, data: comment });
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = validation_1.objectIdSchema.parse(req.params.id);
            const dto = comment_validation_1.updateCommentSchema.parse(req.body);
            const comment = await this.commentService.update((0, current_user_1.getUserId)(req), id, dto);
            return res.status(200).json({ message: "comment updated successfully", success: true, data: comment });
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = validation_1.objectIdSchema.parse(req.params.id);
            await this.commentService.delete((0, current_user_1.getUserId)(req), id);
            return res.status(200).json({ message: "comment deleted successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.CommentController = CommentController;
exports.CommentController = CommentController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.CommentService)),
    __metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentController);

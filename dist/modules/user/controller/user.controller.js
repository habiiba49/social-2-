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
exports.UserController = void 0;
const user_service_1 = require("../service/user.service");
const tokens_1 = require("../../../lib/di/tokens");
const tsyringe_1 = require("tsyringe");
const current_user_1 = require("../../../lib/auth/current-user");
const error_1 = require("../../../lib/error/error");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    uploadProfilePicture = async (req, res, next) => {
        try {
            if (!req.file)
                throw new error_1.AppError("file is required (field name: pp)", 400);
            await this.userService.uploadProfilePicture(req.file, (0, current_user_1.getUserId)(req));
            res.json({ message: "profilepic uploaded successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
    genaratePresignedUrl = async (req, res, next) => {
        try {
            const { fileName, ContentType } = req.body;
            if (!fileName || !ContentType)
                throw new error_1.AppError("fileName and ContentType are required", 400);
            const url = await this.userService.generatPresignedUrl({ mimetype: ContentType, originalname: fileName }, (0, current_user_1.getUserId)(req));
            res.json({ message: "link created successfully", success: true, data: { url } });
        }
        catch (error) {
            next(error);
        }
    };
    deleteProfilePic = async (req, res, next) => {
        try {
            await this.userService.deleteProfilePicture((0, current_user_1.getUserId)(req));
            res.json({ message: "pic deleted successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.UserService)),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);

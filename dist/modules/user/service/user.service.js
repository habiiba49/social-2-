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
exports.UserService = void 0;
const error_1 = require("../../../lib/error/error");
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
const user_repo_1 = require("../repo/user.repo");
let UserService = class UserService {
    userRepo;
    cloudProvider;
    constructor(userRepo, cloudProvider) {
        this.userRepo = userRepo;
        this.cloudProvider = cloudProvider;
    }
    uploadProfilePicture = async (file, userId) => {
        const key = await this.cloudProvider.uploadFile(file, `users/${userId}`);
        await this.userRepo.update({ _id: userId }, { profilePicturePath: key });
    };
    generatPresignedUrl = async (file, userId) => {
        return await this.cloudProvider.generatePresignedUrl(file, `users/${userId}`);
    };
    deleteProfilePicture = async (userId) => {
        const user = await this.userRepo.getOne({ _id: userId });
        if (!user?.profilePicturePath) {
            throw new error_1.AppError('Profile Pic not found', 404);
        }
        await this.cloudProvider.deleteFile(user?.profilePicturePath);
        await this.userRepo.update({ _id: userId }, { $unset: { profilePicPath: 1 } });
    };
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.UserRepo)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.CloudProvider)),
    __metadata("design:paramtypes", [user_repo_1.UserRepo, Object])
], UserService);

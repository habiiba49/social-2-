import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user.service";
import { TOKENS } from "../../../lib/di/tokens";
import { inject, injectable } from "tsyringe";
import { getUserId } from "../../../lib/auth/current-user";
import { AppError } from "../../../lib/error/error";

@injectable()
export class UserController {
    constructor(@inject(TOKENS.UserService) private readonly userService: UserService) {}

    uploadProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) throw new AppError("file is required (field name: pp)", 400);
            await this.userService.uploadProfilePicture(req.file, getUserId(req));
            res.json({ message: "profilepic uploaded successfully", success: true });
        } catch (error) {
            next(error);
        }
    };

    genaratePresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fileName, ContentType } = req.body;
            if (!fileName || !ContentType) throw new AppError("fileName and ContentType are required", 400);
            const url = await this.userService.generatPresignedUrl(
                { mimetype: ContentType, originalname: fileName },
                getUserId(req)
            );
            res.json({ message: "link created successfully", success: true, data: { url } });
        } catch (error) {
            next(error);
        }
    };

    deleteProfilePic = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.userService.deleteProfilePicture(getUserId(req));
            res.json({ message: "pic deleted successfully", success: true });
        } catch (error) {
            next(error);
        }
    };
}
import { Router } from "express";
import {multerUploadSingle} from "../../../lib/media/multer";
import container from "../../../lib/di/container"
import { UserController } from "../controller/user.controller";
import {TOKENS} from "../../../lib/di/tokens"


export const userRouter: Router = Router();

const userController = container.resolve<UserController>(TOKENS.UserController)

userRouter.post('/upload-profile-pic', multerUploadSingle('pp'), userController.uploadProfilePicture);
userRouter.delete('/delete-profile-pic', userController.deleteProfilePic);
userRouter.post('/get-presigned-url', userController.genaratePresignedUrl);


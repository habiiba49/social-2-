import { s3CloudProvider } from "../../../lib/cloud/init";
import { ICloudProvider } from "../../../pkg/cloud/cloud.interface"; 
import  container  from "../../../lib/di/container"
import {AppError} from "../../../lib/error/error"
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens"; 
import { UserRepo } from "../repo/user.repo";



@injectable()

export class UserService {

    constructor( @inject(TOKENS.UserRepo) private readonly userRepo: UserRepo ,
            @inject(TOKENS.CloudProvider) private readonly cloudProvider: ICloudProvider){
              
            }
    

    uploadProfilePicture = async (file: Express.Multer.File, userId : string ) => {
       const key = await this.cloudProvider.uploadFile(file, `users/${userId}`); 
       await this.userRepo.update(
        {_id: userId}, 
        {profilePicturePath: key}
    );
            
    }


    generatPresignedUrl = async(file: Partial<Express.Multer.File>, userId: string ) => {
      return await this.cloudProvider.generatePresignedUrl(file, `users/${userId}`)
    }


    deleteProfilePicture = async (userId: string): Promise<void> => {
    const user = await this.userRepo.getOne({ _id: userId });
    if (!user?.profilePicturePath) {
      throw new AppError('Profile Pic not found', 404);
    }
    await this.cloudProvider.deleteFile(user?.profilePicturePath);
    await this.userRepo.update({ _id: userId }, { $unset: { profilePicturePath: 1 } });
  };
}


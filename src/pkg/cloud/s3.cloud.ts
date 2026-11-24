import { ICloudProvider } from "./cloud.interface";
import {  DeleteObject$, DeleteObjectCommand, GetObjectAclCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Multer } from "multer";
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import { toSeconds } from "../utils/time";

interface S3Config{
    accessKey: string, 
    secretKey: string , 
    bucketName: string 

}

export class S3CloudProvider implements ICloudProvider{
    private client: S3Client ;
    private readonly bucketName: string; 

    constructor (config: any ){
        this.client = new S3Client({
            credentials:{
                accessKeyId: config.accessKey,
                secretAccessKey: config.secretKey,
            }
             
        })
        this.bucketName= config.bucketName;

    }

    public async uploadFile(file: Express.Multer.File , path: string): Promise<string> {
    const command = new PutObjectCommand({
       Bucket: this.bucketName, 
       Body : file.buffer, 
       ContentType: file.mimetype, 
       Key: `${path}/${new Date().toISOString()}-${file.originalname}`
    }); 
     await this.client.send(command);
     return command.input.Key as string ;
    }


    public async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand ({
            Bucket: this.bucketName, 
            Key: key
        })
        await this.client.send(command);
    }

    public getFile(key: string): Promise<Buffer> {
        throw new Error("can not find the file ")
    }


   public async generatePresignedUrl(file: Express.Multer.File, path: string) {
    const command = new PutObjectCommand({
            Bucket: this.bucketName, 
            Key: `${path}/${file.originalname}`, 
            ContentType: file.mimetype
    });
     return await getSignedUrl(this.client, command, {expiresIn: toSeconds(1, 'minutes')})
   }
};
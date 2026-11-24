import { Multer } from "multer"
export interface ICloudProvider{
    uploadFile(file: Express.Multer.File, path: string ):Promise<string> // return url 
    deleteFile(key: string): Promise<void>
    getFile (key:string): Promise<Buffer>
    generatePresignedUrl(file: Partial<Express.Multer.File>, path: string): Promise<string>;
    
}
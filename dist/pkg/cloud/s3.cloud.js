"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3CloudProvider = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const time_1 = require("../utils/time");
class S3CloudProvider {
    client;
    bucketName;
    constructor(config) {
        this.client = new client_s3_1.S3Client({
            credentials: {
                accessKeyId: config.accessKey,
                secretAccessKey: config.secretKey,
            }
        });
        this.bucketName = config.bucketName;
    }
    async uploadFile(file, path) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Body: file.buffer,
            ContentType: file.mimetype,
            Key: `${path}/${new Date().toISOString()}-${file.originalname}`
        });
        await this.client.send(command);
        return command.input.Key;
    }
    async deleteFile(key) {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key
        });
        await this.client.send(command);
    }
    getFile(key) {
        throw new Error("can not find the file ");
    }
    async generatePresignedUrl(file, path) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: `${path}/${file.originalname}`,
            ContentType: file.mimetype
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, { expiresIn: (0, time_1.toSeconds)(1, 'minutes') });
    }
}
exports.S3CloudProvider = S3CloudProvider;
;

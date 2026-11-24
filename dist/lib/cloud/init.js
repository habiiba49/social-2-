"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3CloudProvider = void 0;
const s3_cloud_1 = require("../../pkg/cloud/s3.cloud");
const env_1 = require("../config/env");
exports.s3CloudProvider = new s3_cloud_1.S3CloudProvider({
    secretKey: env_1.env.aws.secretKey,
    accessKey: env_1.env.aws.accessKey,
    bucketName: env_1.env.aws.bucketName
});

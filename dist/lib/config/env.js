"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const schema = zod_1.z.object({
    PORT: zod_1.z.string().default('3000'),
    DB_URL: zod_1.z.string(),
    JWT_ACCESS_SECRET: zod_1.z.string(),
    JWT_REFRESH_SECRET: zod_1.z.string(),
    MAIL_USER: zod_1.z.string().trim().toLowerCase(),
    MAIL_PASS: zod_1.z.string(),
    MAIL_HOST: zod_1.z.string().default('smtp.gmail.com'),
    MAIL_PORT: zod_1.z.string().default('587'),
    GOOGLE_WEB_OAUTH_CLIENT_ID: zod_1.z.string(),
    GOOGLE_IOS_OAUTH_CLIENT_ID: zod_1.z.string().optional(),
    REDIS_PORT: zod_1.z.string().default('6379'),
    REDIS_HOST: zod_1.z.string(),
    REDIS_PASSWORD: zod_1.z.string(),
    MAILJET_API_KEY: zod_1.z.string(),
    MAILJET_API_SECRET: zod_1.z.string(),
    MAILJET_FROM_EMAIL: zod_1.z.string(),
    MAILJET_FROM_NAME: zod_1.z.string(),
    S3_BUCKET_NAME: zod_1.z.string(),
    S3_SECRET_KEY: zod_1.z.string(),
    S3_ACCESS_KEY: zod_1.z.string(),
    S3_REGION: zod_1.z.string().default('us-east-1'),
});
const parsed = schema.parse(process.env);
exports.env = {
    port: Number(parsed.PORT),
    db: {
        url: parsed.DB_URL
    },
    redis: {
        host: parsed.REDIS_HOST,
        port: Number(parsed.REDIS_PORT),
        password: parsed.REDIS_PASSWORD
    },
    nodemailer: {
        host: parsed.MAIL_HOST,
        port: Number(parsed.MAIL_PORT),
        user: parsed.MAIL_USER,
        password: parsed.MAIL_PASS,
        fromEmail: parsed.MAIL_USER,
        fromName: 'Social App'
    },
    jwt: {
        secret: parsed.JWT_ACCESS_SECRET,
        refreshSecret: parsed.JWT_REFRESH_SECRET
    },
    google: {
        webClientId: parsed.GOOGLE_WEB_OAUTH_CLIENT_ID,
        iosClientId: parsed.GOOGLE_IOS_OAUTH_CLIENT_ID ?? parsed.GOOGLE_WEB_OAUTH_CLIENT_ID,
    },
    mailjet: {
        apiKey: parsed.MAILJET_API_KEY,
        apiSecret: parsed.MAILJET_API_SECRET,
        fromEmail: parsed.MAILJET_FROM_EMAIL,
        fromName: parsed.MAILJET_FROM_NAME
    },
    payments: {},
    aws: {
        secretKey: parsed.S3_SECRET_KEY,
        accessKey: parsed.S3_ACCESS_KEY,
        bucketName: parsed.S3_BUCKET_NAME
    }
};

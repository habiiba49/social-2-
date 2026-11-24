"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodemailerProvider = exports.mailjetProvider = void 0;
const mailjit_1 = require("../../pkg/notification/mailjit");
const nodemailer_1 = require("../../pkg/notification/nodemailer");
const env_1 = require("../config/env");
exports.mailjetProvider = new mailjit_1.MailjetProvider({
    apiKey: env_1.env.mailjet.apiKey,
    apiSecret: env_1.env.mailjet.apiSecret,
    fromEmail: env_1.env.mailjet.fromEmail,
    fromName: env_1.env.mailjet.fromName
});
exports.nodemailerProvider = new nodemailer_1.NodemailerProvider(env_1.env.nodemailer);

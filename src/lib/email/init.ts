import {MailjetProvider}  from "../../pkg/notification/mailjit";
import { NodemailerProvider } from "../../pkg/notification/nodemailer";
import { env } from "../config/env";

export const mailjetProvider = new MailjetProvider ({
    apiKey: env.mailjet.apiKey,
    apiSecret: env.mailjet.apiSecret,
    fromEmail: env.mailjet.fromEmail,
    fromName: env.mailjet.fromName
})

export const nodemailerProvider = new NodemailerProvider (env.nodemailer);
import Mailjet from 'node-mailjet';
import { MailProvider } from './mail.interface';

interface IMailjetConfig {
  apiKey : string,
  apiSecret : string ,
  fromEmail: string ,
  fromName : string
}


export class MailjetProvider implements MailProvider{
    private client: Mailjet;
    private fromEmail : string; 
    private fromName : string  ; 

    constructor(config: IMailjetConfig){
        this.client = new Mailjet({
            apiKey: config.apiKey, 
            apiSecret:config.apiSecret
        });
        this.fromName = config.fromName;
        this.fromEmail = config.fromEmail;

    }
       async SendMail (to: string , title: string ,body: string ){
             await this.client.post('send', { version: 'v3.1' }).request({
  Messages: [
    {
      From: {
        Email: this.fromEmail,
        Name: this.fromName,
      },
      To: [
        {
          Email: to,
        },
      ],
      Subject: title ,
      HTMLPart: body,
    },
  ],
})} }

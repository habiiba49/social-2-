
import {createTransport, Transporter} from 'nodemailer';
import { MailProvider } from './mail.interface';

interface INodemailerConfig{
    host: string , 
    port : number , 
    user : string , 
    password: string , 
    fromEmail : string , 
    fromName: string

}

export class NodemailerProvider implements MailProvider{
    private client: Transporter;
    private readonly fromEmail : string; 
    private readonly fromName : string  ; 

    constructor(config: any){
        this.client = createTransport({
            host: config.host ,
            port: config.port,
            secure: config.port === 465,

            auth: {
                user: config.user,
                pass:config.password
            }
            
        });
        this.fromName = config.fromName;
        this.fromEmail = config.fromEmail;

    }
       async SendMail (to: string , title: string ,body: string ){
             await this.client.sendMail({
                from : `"${this.fromName}" <${this.fromEmail}>`,
                to: to, 
                subject: title , 
                html : body
             })
    }
  
}
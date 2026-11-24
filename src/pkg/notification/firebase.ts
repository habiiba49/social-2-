import { MailProvider } from "./mail.interface";
import {App, initializeApp, cert} from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { Message } from "firebase-admin/messaging";


export class FireBaseProvider implements MailProvider {
    private readonly client :App;

    constructor(config: any ){
        this.client =  initializeApp({
            credential: cert(config)
        })}

    async SendMail(to: string , title: string, body: string ): Promise<void> {
        const message: Message= {
            token: to , 
            notification:{
                title, 
            }
        }
        await getMessaging(this.client).send(message);
    }
}

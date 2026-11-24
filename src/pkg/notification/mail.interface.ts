export interface MailProvider {
    SendMail (to: string , title: string ,body: string ): Promise<void>
}

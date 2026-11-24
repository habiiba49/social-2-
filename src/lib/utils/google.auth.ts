import { AppError } from "../error/error"
import{env} from "../config/env"
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client()

export async function verifiyGoogleToken (idToken: string ){
    try {
        const ticket = await client.verifyIdToken({
          idToken: idToken,
          audience: [env.google.webClientId,env.google.iosClientId]

        });
        return ticket.getPayload();
      } catch(error){
    throw new AppError('invalid google token', 403)
} 
}



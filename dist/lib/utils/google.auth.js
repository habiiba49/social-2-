"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifiyGoogleToken = verifiyGoogleToken;
const error_1 = require("../error/error");
const env_1 = require("../config/env");
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client();
async function verifiyGoogleToken(idToken) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: [env_1.env.google.webClientId, env_1.env.google.iosClientId]
        });
        return ticket.getPayload();
    }
    catch (error) {
        throw new error_1.AppError('invalid google token', 403);
    }
}

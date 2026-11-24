import  jwt from "jsonwebtoken";
import argon2 from "argon2"; 
import {env} from "../../lib/config/env";
import { toMs, toSeconds } from "../../pkg/utils/time";
import { Response } from "express";


export async function hashPassword(password: string){
    return argon2.hash(password)
}

export async function comparePassword (password: string , hashedPassword: string ){
    return argon2.verify( hashedPassword, password)
}

export function generateAccessToken(payload: any){
    return jwt.sign (
        payload, env.jwt.secret, 
        {expiresIn: toSeconds(1, "hours")}
    )
}

export function generateRefreshToken(payload: any){
    return jwt.sign(
        payload, env.jwt.refreshSecret, 
        {expiresIn: toSeconds(7 * 24, "hours")}
    );
}


export function setCookies (res: Response , accessToken : string , refreshToken : string ){
    res.cookie ('access_token', accessToken, {
        httpOnly: true , 
        maxAge: toMs (1, 'hours')
    }); 
    res.cookie ('refresh_token', refreshToken, {
        httpOnly: true , 
        maxAge: toMs(7, 'hours'), 
        path : '/api/auth/refresh-token'
    })

}

export function sanitizeUser(user: any) {
    const obj = typeof user?.toObject === "function" ? user.toObject() : { ...user };
    delete obj.password;
    delete obj.__v;
    return obj;}
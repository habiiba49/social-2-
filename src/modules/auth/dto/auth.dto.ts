import {Gender} from "../../../lib/enum/index"

export interface RegisterDto{

userName: string,
password: string,
phoneNumber?: string,
email: string,
DOB : Date,
gender? : Gender ,
profilepic: string, 
isVerified?: boolean, 
isDeleted?: boolean 
}

export interface LoginDto{
email: String,
password: String
}

export interface SendOtpDto {
    email: string,
}

export interface VerfyAccountDto{

    email: string,
    code: string 
}




import {Provider, Gender} from "../../../lib/enum";
import { Types } from "mongoose";

export interface Iuser{
    _id :Types.ObjectId;
    userName : string;
    email: string;
    password?: string;
    provider: Provider;
    phoneNumber?: string;
    DOB?: Date;
    gender?: Gender;
    isVerified?: boolean;
    isDeleted?: boolean;
    profilePicturePath?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
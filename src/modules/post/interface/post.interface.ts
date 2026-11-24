import { Types } from "mongoose";

export interface IPost {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}

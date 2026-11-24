import { model, Schema } from "mongoose";
import { IComment } from "../interface/comment.interface";

const schema = new Schema<IComment>(
    {
        post: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        content: { type: String, required: true, trim: true, minlength: 1, maxlength: 2000 },
    },
    { timestamps: true }
);

export const Comment = model<IComment>("Comment", schema);
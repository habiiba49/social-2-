import { model, Schema } from "mongoose";
import { IPost } from "../interface/post.interface";

const schema = new Schema<IPost>(
    {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        content: { type: String, required: true, trim: true, minlength: 1, maxlength: 5000 },
    },
    { timestamps: true }
);

export const Post = model<IPost>("Post", schema);

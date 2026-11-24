"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    post: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, required: true, trim: true, minlength: 1, maxlength: 2000 },
}, { timestamps: true });
exports.Comment = (0, mongoose_1.model)("Comment", schema);

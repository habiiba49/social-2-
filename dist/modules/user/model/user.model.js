"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.schema = void 0;
const mongoose_1 = require("mongoose");
const enum_1 = require("../../../lib/enum");
exports.schema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        required: true,
        type: String,
        lowercase: true,
        trim: true,
        minlength: 3,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: function () {
            return this.provider === enum_1.Provider.LOCAL;
        }
    },
    provider: {
        type: Number,
        enum: enum_1.Provider,
        default: enum_1.Provider.LOCAL
    },
    profilePicturePath: String,
    phoneNumber: { type: String, trim: true },
    DOB: Date,
    gender: { type: Number, enum: [0, 1] },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', exports.schema);

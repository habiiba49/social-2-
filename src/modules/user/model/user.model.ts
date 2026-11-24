import { model, Schema } from "mongoose";
import { Iuser } from "../interface/user.interface";
import {Gender, Provider } from "../../../lib/enum";


export const schema = new Schema<Iuser>({

userName: {
    type: String , 
    required: true ,
    trim : true , 
    minlength: 2, 
    maxlength: 20 

}, 

email: {
    required : true ,
    type : String, 
    lowercase: true ,
    trim: true ,
    minlength: 3, 
    unique: true },

password : {
    type : String,
    trim: true ,
    required: function(this){
      return this.provider === Provider.LOCAL;
}
},

provider: {
    type : Number , 
    enum : Provider, 
    default: Provider.LOCAL
}, 

profilePicturePath: String,

phoneNumber: { type: String, trim: true },

DOB: Date,

gender: { type: Number, enum: [0, 1] },

isVerified: { type: Boolean, default: false },

isDeleted: { type: Boolean, default: false },

},{ timestamps: true })



export const User = model('User', schema);
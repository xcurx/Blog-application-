import mongoose, { Schema } from "mongoose";

const followModel = Schema({
    account:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    follower:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export const Follow = mongoose.model("Follow",followModel)
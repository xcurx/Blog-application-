import mongoose, { Schema } from "mongoose";

const commentModel = Schema({
    post:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    commentedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    isReplyToComment:{
        type:Boolean
    },
    commentRepliedTo:{
        type:Schema.Types.ObjectId,
        ref:"Comment",
    },
    content:{
        type:String,
        required:true
    }
},{timeStamps:true})

export const Comment = mongoose.model("Comment",commentModel)
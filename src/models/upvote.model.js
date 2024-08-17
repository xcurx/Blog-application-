import mongoose,{Schema} from "mongoose"; 

const upvoteSchema = Schema({
    post:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    account:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export const Upvote = mongoose.model("Upvote",upvoteSchema)
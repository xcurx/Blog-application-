import mongoose,{Schema} from "mongoose"; 

const postSchema = Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String
    },
    images:[
        {
            type:String
        }
    ],
    videos:{
        type:String
    },
    isVisible:{
        type:Boolean,
        default:true
    },
    account:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export const Post = mongoose.model("Post",postSchema)
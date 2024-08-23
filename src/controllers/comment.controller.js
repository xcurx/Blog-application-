import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponce } from "../utils/ApiResponce.js"
import { Post } from "../models/post.model.js"

const comment = asyncHandler(async (req,res) => {
    const {postId,commentId,content} = req.body

    if(!postId || !content.trim()){
        throw new ApiError(400,"Post id and content is required")   
    }

    if(!req.user){
        throw new ApiError(401,"Unautorized request")
    }
    
    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new ApiError(400,"Invalid Post Id")
    }
    if(commentId && !mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400,"Invalid Comment Id")
    }

    const postExist = await Post.findById(postId)
    if(!postExist){
        throw new ApiError(400,"Post dosen't exist")
    }
    if(commentId){
        const commentExist = await Comment.findById(commentId)
        if(!commentExist){
            throw new ApiError(400,"Comment dosen't exist")
        }
    }

    const comment = await Comment.create({
        post: postId,
        commentedBy: req.user._id,
        isReplyToComment: commentId?true:false,
        commentRepliedTo: commentId,
        content
    })
    if(!comment){
        throw new ApiError(500,"Something went wrong while commenting")
    }

    return res.status(200)
              .json(new ApiResponce(200,comment,"Comment Successfull"))
})

export {
    comment,
}
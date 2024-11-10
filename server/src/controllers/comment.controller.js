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

    let comment = await Comment.create({
        post: postId,
        commentedBy: req.user._id,
        isReplyToComment: commentId?true:false,
        commentRepliedTo: commentId,
        content
    })
    comment = await comment.populate('commentedBy', '-password -refreshToken -bio')

    if(!comment){
        throw new ApiError(500,"Something went wrong while commenting")
    }

    return res.status(200)
              .json(new ApiResponce(201,comment,"Comment Successfull"))
})

const getAllReplies = asyncHandler(async (req,res) => {
    const {commentId} = req.params

    const replies = await Comment.aggregate([
        {
            $match:{
                commentRepliedTo: new mongoose.Types.ObjectId(commentId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"commentedBy",
                foreignField:"_id",
                as:"commentedBy",
                pipeline:[
                    {
                        $project:{
                            password:0,
                            refreshToken:0,
                            bio:0,
                        }
                    }
                ]
            }
        },
        {
            $unwind:"$commentedBy"
        }
    ])
    if(!replies){
        throw new ApiError(500,"Something went wrong")
    }

    res.status(200)
       .json(new ApiResponce(200,replies,"Replies collected"))
})

const getAllComments = asyncHandler(async (req,res) => {
    const {postId} = req.params

    const comments = await Comment.aggregate([
        {
            $match:{
                post: new mongoose.Types.ObjectId(postId),
                isReplyToComment:false
            }
        },
        {
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"commentRepliedTo",
                as:"replies",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"commentedBy",
                            foreignField:"_id",
                            as:"commentedBy",
                            pipeline:[
                                {
                                    $project:{
                                        password:0,
                                        refreshToken:0,
                                        bio:0,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $unwind:"$commentedBy"
                    }
                ]
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"commentedBy",
                foreignField:"_id",
                as:"commentedBy",
                pipeline:[
                    {
                        $project:{
                            password:0,
                            refreshToken:0,
                            bio:0,
                        }
                    }
                ]
            }
        },
        {
            $unwind:"$commentedBy"
        }
    ])
    if(!comments){
        throw new ApiError(500,"Something went wrong")
    }

    res.status(200)
       .json(new ApiResponce(200,comments,"Comments collected"))
})

export {
    comment,
    getAllReplies,
    getAllComments
}
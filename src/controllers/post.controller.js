import mongoose from 'mongoose'
import { Post } from '../models/post.model.js'
import { Upvote } from '../models/upvote.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponce } from '../utils/ApiResponce.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'

const createPost = asyncHandler(async (req,res) => {
    const {title, content} = req.body
    
    if(!title){
        throw new ApiError(400,"Title is required")
    }

    if(!req.user){
        throw new ApiError(402,"Unauthorized request")
    }

    const imageLocalPaths = req.files?.images?.map((e) => e?.path)
    let images = []
    if(imageLocalPaths || imageLocalPaths?.length > 0){
        images = await Promise.all(
            imageLocalPaths.map(async (e) => (await uploadOnCloudinary(e)).url)
        )
    }
    
    const post = await Post.create({
        title,
        content,
        images,
        account: req.user._id
    })
    if(!post){
        throw new ApiError(501, "Something went wrong while creating the post")
    }

    return res.status(200)
              .json(new ApiResponce(200,post,"Post created successfully"))
})

const upvote = asyncHandler(async (req,res) => {
    const {postId} = req.body

    if(!postId){
        throw new ApiError(400,"Post ID is required")
    }

    if(!req.user){
        throw new ApiError(401,"Unauthorized request")
    }

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new ApiError(400,"No such post exists")
    }

    const postExist = await Post.findById(postId)
    if(!postExist){
        throw new ApiError(400,"No such post exists")
    }
                            
    const upvoteExist = await Upvote.findOne({ post:postExist?._id, account: req.user._id})
    if(upvoteExist){
        throw new ApiError(401,"The post is already upvoted from this account")
    }

    const upvote = await Upvote.create({
        post:postId,
        account:req.user._id
    })

    if(!upvote){
        throw new ApiError(500,"Something went wrong while upvoting")
    }

    res.status(200)
       .json(new ApiResponce(200,upvote,"Upvote successfull"))
})

export {
    createPost,
    upvote
}
import { Post } from '../models/post.model.js'
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

export {
    createPost
}
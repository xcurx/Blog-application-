import mongoose from 'mongoose'
import { Follow } from '../models/follow.model.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'
import { ApiResponce } from '../utils/ApiResponce.js'

const follow = asyncHandler(async (req,res) => {
    const {accountId} = req.params

    if(!accountId){
        throw new ApiError(400,"Account Id is required")
    }

    if(!req.user){
        throw new ApiError(401,"Unauthorized request")
    }

    if(!mongoose.Types.ObjectId.isValid(accountId)){
        throw new ApiError(400,"Invalid account Id")
    }
    
    const accountExist = await User.findById(accountId)
    if(!accountExist){
        throw new ApiError(400,"No such account")
    }

    const followExist = await Follow.findOne({account:accountId, follower:req.user._id})
    if(followExist){
        throw new ApiError(400,"Account already followed by current user")
    }
    
    const follow = await Follow.create({
        account: accountId,
        follower: req.user._id
    })

    return res.status(200)
              .json(new ApiResponce(200,follow,"Account Followed"))
})

const unfollow = asyncHandler(async (req,res) => {
    const {accountId} = req.params

    if(!accountId){
        throw new ApiError(400,"Account Id is required")
    }

    if(!req.user){
        throw new ApiError(401,"Unauthorized request")
    }

    if(!mongoose.Types.ObjectId.isValid(accountId)){
        throw new ApiError(400,"Invalid account Id")
    }
    
    const accountExist = await User.findById(accountId)
    if(!accountExist){
        throw new ApiError(400,"No such account")
    }
    
    const unfollow = await Follow.findOneAndDelete({ account:accountId, follower:req.user._id })
    if(!unfollow){
        throw new ApiError(400,"Account already unfollowed by current user")
    }

    return res.status(200)
              .json(new ApiResponce(200,unfollow,"Account Unfollowed"))
})

export {
    follow,
    unfollow
}
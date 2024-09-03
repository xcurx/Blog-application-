import {asyncHandler} from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponce} from '../utils/ApiResponce.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'

const options = {
    httpOnly:true,
    secure:true
}

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:true})
    
        return {refreshToken, accessToken}
    } catch (error) {
        throw new ApiError(400,"Error generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req,res) => {
    const {username, email, name, password} = req.body

    if([username, email, name, password].some(e => e==null || e?.trim() === "")){
        throw new ApiError(400,"All fields are required")
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    const isValidEmail = emailRegex.test(email);
    if(!isValidEmail){
        throw new ApiError(400,"Email is not vaild")
    }

    if(password.length < 8){
        throw new ApiError(400,"Password must have atleast eight characters")
    }

    const isExist = await User.findOne({
        $or: [{ username },{ email }]
    })

    if(isExist){
        throw new ApiError(400,"User already exists")
    }

    const user = await User.create({
        username: username.toLowerCase(), 
        email,
        password,
        name
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(200)
              .json(new ApiResponce(200,createdUser,"User successfully registered"))
})

const login = asyncHandler(async (req,res) => {
    const {username, email, password} = req.body

    if(!(username || email)){
        throw new ApiError(400,"Either username or email is required")
    }
    if(!password){
        throw new ApiError(400,"Password is required")
    }

    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    })
    if(!existedUser){
        throw new ApiError(402,"User dosen't exist")
    }
    
    const isPasswordCorrect = existedUser.isPasswordCorrect(password)
    if(!isPasswordCorrect){
        throw new ApiError(403,"Incorrect password")
    }

    const {refreshToken,accessToken} = await generateAccessAndRefreshToken(existedUser._id)

    const user = await User.findById(existedUser._id).select("-password -refreshToken")

    return res.status(200)
              .cookie("accessToken",accessToken,options)
              .cookie("refreshToken",refreshToken,options)
              .json(new ApiResponce(
                200,
                {
                    user,
                    refreshToken,
                    accessToken
                },
                "Refresh Token and Access Token generated"
              ))
})

const logout = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )
    
    return res.status(200)
              .clearCookie("accessToken",options)
              .clearCookie("refreshToken",options)
              .json(new ApiResponce(200,{},"User successfully logged out"))
})

const updateProfilePicture = asyncHandler(async (req,res) => {
    if(!req.user){
        throw new ApiError(401,"Unauthorized request")
    }

    const user = req.user

    const profilePicLocalPath = req.file?.path
    if(profilePicLocalPath){
        const profilePic = await uploadOnCloudinary(profilePicLocalPath)
        if(!profilePic.url){
            throw new ApiError(500,"Error Uploading")
        }
        user.profilePicture = profilePic.url
        await user.save()
    }else{
        await user.updateOne({ $unset:{ profilePicture:"" } })
    }

    return res.status(200)
              .json(new ApiResponce(200,user,"Profile picture updated"))
})

const updateProfile = asyncHandler(async (req,res) => {
    const {username,name,bio} = req.body

    if(!username?.trim() && !name?.trim() && !bio?.trim()){
        throw new ApiError(400, "No fields to update")
    }

    if(!req.user){
        throw new ApiError(401, "Unauthorized request")
    }

    if(username?.trim()){
        const userExist = await User.findOne({ username })
        if(userExist){
            throw new ApiError(400,"This username already exists")
        }
    }

    const user = req.user
    user.username = username || user.username
    user.name = name || user.name
    user.bio = bio || user.bio
    await user.save()
    
    return res.status(200)
              .json(new ApiResponce(200,user,"User profile updated successfully"))
})

export {
    registerUser,
    login,
    logout,
    updateProfilePicture,
    updateProfile,
}
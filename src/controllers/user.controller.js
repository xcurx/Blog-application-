import {asyncHandler} from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponce} from '../utils/ApiResponce.js'

const options = {
    httpOnly:true,
    secure:true
}

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        refreshToken = user.generateRefreshToken()
        accessToken = user.generateAccessToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:true})
    
        return {refreshToken, accessToken}
    } catch (error) {
        throw new ApiError(400,"Error generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req,res) => {
    // get user details -- done
    // check if all details present or not -- done
    // validate details -- done
    // check if user already exists -- done
    // create db entry -- done
    // retrun res -- done

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
    // user details -- done
    // check details -- done
    // check if user exists or not -- done
    // password check -- done
    // refresh and access token -- done
    // send cookie -- done

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

    const {refreshToken,accessToken} = generateAccessAndRefreshToken(existedUser._id)

    const user = await User.findById(existedUser._id).select("-password -refreshToken")

    return res.status(200)
              .cookie("accessToken",accessToken,options)
              .cookie("refreshToken",refreshToken,options)
              .json(new ApiResponce(
                200,
                {
                    refreshToken,
                    accessToken
                },
                "Refresh Token and Access Token generated"
              ))
})

export {
    registerUser,
    login
}
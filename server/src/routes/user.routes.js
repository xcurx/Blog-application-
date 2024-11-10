import { Router } from "express";
import { getUser, login, logout, profile, registerUser, updateProfile, updateProfilePicture } from "../controllers/user.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { follow, unfollow } from "../controllers/follow.contoller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/register").post(registerUser)

// secured
router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)

router.route("/follow/:accountId").post(verifyJWT,follow)
router.route("/unfollow/:accountId").post(verifyJWT,unfollow)

router.route("/account/update").patch(verifyJWT,updateProfile)
router.route("/account/avatar").patch(verifyJWT,upload.single("profilePic"),updateProfilePicture)
router.route("/account/profile").get(verifyJWT,getUser)

router.route("/profile/:username").get(verifyJWT,profile)

export default router
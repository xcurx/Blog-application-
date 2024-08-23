import { Router } from "express";
import { login, logout, registerUser } from "../controllers/user.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { follow, unfollow } from "../controllers/follow.contoller.js";

const router = Router()

router.route("/register").post(registerUser)

// secured
router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)

router.route("/follow/:accountId").post(verifyJWT,follow)
router.route("/unfollow/:accountId").post(verifyJWT,unfollow)

export default router
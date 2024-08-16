import { Router } from "express";
import { login, logout, registerUser } from "../controllers/user.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/register").post(registerUser)

// secured
router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)

export default router
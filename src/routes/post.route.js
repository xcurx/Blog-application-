import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { allPosts, createPost, downVote, upvote } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { comment } from "../controllers/comment.controller.js";

const router = Router()

router.route("/create-post").post(
    upload.fields([
        {
            name:"images",
            maxCount:10
        },
    ]),
    verifyJWT,createPost)

router.route("/upvote").post(verifyJWT,upvote)
router.route("/downvote").post(verifyJWT,downVote)
router.route("/allposts/:username").get(verifyJWT,allPosts)

router.route("/comment").post(verifyJWT,comment)

export default router
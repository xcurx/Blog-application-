import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { allPosts, createPost, downVote, getPost, getUserPosts, homePosts, upvote } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { comment, getAllComments, getAllReplies } from "../controllers/comment.controller.js";

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
router.route("/myposts").get(verifyJWT,getUserPosts)
router.route("/allposts/:username").get(verifyJWT,allPosts)
router.route("/comments/:postId").get(verifyJWT,getAllComments)
router.route("/replies/:commentId").get(verifyJWT,getAllReplies)

router.route("/home").get(verifyJWT,homePosts)

router.route("/comment").post(verifyJWT,comment)

router.route("/:postId").get(verifyJWT,getPost)


export default router
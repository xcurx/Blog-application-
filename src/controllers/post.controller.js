import mongoose, { ObjectId } from "mongoose";
import { Post } from "../models/post.model.js";
import { Upvote } from "../models/upvote.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  if (!req.user) {
    throw new ApiError(402, "Unauthorized request");
  }

  const imageLocalPaths = req.files?.images?.map((e) => e?.path);
  let images = [];
  if (imageLocalPaths || imageLocalPaths?.length > 0) {
    images = await Promise.all(
      imageLocalPaths.map(async (e) => (await uploadOnCloudinary(e)).url)
    );
  }

  const post = await Post.create({
    title,
    content,
    images,
    account: req.user._id,
  });
  if (!post) {
    throw new ApiError(501, "Something went wrong while creating the post");
  }

  return res
    .status(200)
    .json(new ApiResponce(201, post, "Post created successfully"));
});

const upvote = asyncHandler(async (req, res) => {
  const { postId } = req.body;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  if (!req.user) {
    throw new ApiError(401, "Unauthorized request");
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  const postExist = await Post.findById(postId);
  if (!postExist) {
    throw new ApiError(400, "No such post exists");
  }

  const upvoteExist = await Upvote.findOne({
    post: postExist?._id,
    account: req.user._id,
  });
  if (upvoteExist) {
    throw new ApiError(400, "The post is already upvoted from this account");
  }

  const upvote = await Upvote.create({
    post: postId,
    account: req.user._id,
  });

  if (!upvote) {
    throw new ApiError(500, "Something went wrong while upvoting");
  }

  res.status(200).json(new ApiResponce(200, upvote, "Upvote successfull"));
});

const downVote = asyncHandler(async (req, res) => {
  const { postId } = req.body;

  if (!postId) {
    throw new ApiError(400, "Post Id is required");
  }

  if (!req.user) {
    throw new ApiError(401, "Unauthorized request");
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  const postExist = await Post.findById(postId);
  if (!postExist) {
    throw new ApiError(400, "No such post exist");
  }

  const downVote = await Upvote.findOneAndDelete({
    post: postExist?._id,
    account: req.user._id,
  });
  if (!downVote) {
    throw new ApiError(400, "This post has not been upvoted by this account");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, downVote, "Downvote successfull"));
});

const allPosts = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username.trim()) {
    throw new ApiError(400, "Username is required");
  }

  const postData = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "account",
        as: "posts",
      },
    },
    {
      $project: {
        username: 1,
        name: 1,
        posts: 1,
      },
    },
  ]);

  if (!postData?.length) {
    throw new ApiError(404, "Account dosent exist");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, postData[0], "All posts fetched"));
});

const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(400, "Post Id is required");
  }

  if (!req.user) {
    throw new ApiError(401, "Unauthorized request");
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid Post Id");
  }

  const post = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "account",
        foreignField: "_id",
        as: "account",
        pipeline: [
          {
            $project: {
              username: 1,
              name: 1,
              profilePicture: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        account: {
          $first: "$account",
        },
      },
    },
    {
      $lookup: {
        from: "upvotes",
        localField: "_id",
        foreignField: "post",
        as: "upvotedBy",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "account",
              foreignField: "_id",
              as: "account",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    name: 1,
                    profilePicture: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              account: {
                $first: "$account",
              },
            },
          },
          {
            $project: {
              account: {
                username: 1,
                name: 1,
                profilePicture: 1,
              },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "comments",
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$post", new mongoose.Types.ObjectId(postId)],
                  },
                  {
                    $eq: ["$isReplyToComment", false],
                  }, // to start with original comments
                ],
              },
            },
          },
          {
            $graphLookup: {
              from: "comments",
              startWith: "$_id",
              connectFromField: "_id",
              connectToField: "commentRepliedTo",
              as: "replies",
              restrictSearchWithMatch: {
                post: new mongoose.Types.ObjectId(postId),
              },
            },
          },
          {
            $unwind: {
              path: "$replies",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "replies.commentedBy",
              foreignField: "_id",
              as: "replies.commentedBy",
            },
          },
          {
            $unwind: {
              path: "$replies.commentedBy",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: "$_id",
              post: { $first: "$post" },
              commentedBy: {
                $first: "$commentedBy",
              },
              isReplyToComment: {
                $first: "$isReplyToComment",
              },
              commentRepliedTo: {
                $first: "$commentRepliedTo",
              },
              content: { $first: "$content" },
              createdAt: { $first: "$createdAt" },
              commentedBy: {
                $first: "$commentedBy",
              },
              replies: { $push: "$replies" },
            },
          },
          {
            $project: {
              _id: 1,
              commentedBy: 1,
              isReplyToComment: 1,
              commentRepliedTo: 1,
              content: 1,
              createdAt: 1,
              commentedBy: {
                _id: 1,
                name: 1,
                username: 1,
                profilePicture: 1,
              },
              replies: {
                _id: 1,
                commentedBy: 1,
                isReplyToComment: 1,
                commentRepliedTo: 1,
                content: 1,
                createdAt: 1,
                commentedBy: {
                  _id: 1,
                  name: 1,
                  username: 1,
                  profilePicture: 1,
                },
              },
            },
          },
          {
            $sort: { createdAt: 1 },
          },
          {
            $lookup: {
              from: "users",
              localField: "commentedBy",
              foreignField: "_id",
              as: "commentedBy",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    name: 1,
                    profilePicture: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              commentedBy: {
                $first: "$commentedBy",
              },
            },
          },
        ],
        as: "comments",
      },
    },
  ]);

  if (!post) {
    throw new ApiError(400, "No such post");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, post, "Post data retreived"));
});

export { createPost, upvote, downVote, allPosts, getPost };

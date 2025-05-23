import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const existing = await Like.findOne({ video: videoId, user: userId })
    if (existing) {
        await existing.deleteOne()
        return res.status(200).json(new ApiResponse(200, null, "Video unliked"))
    } else {
        await Like.create({ video: videoId, user: userId })
        return res.status(201).json(new ApiResponse(201, null, "Video liked"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    const existing = await Like.findOne({ comment: commentId, user: userId })
    if (existing) {
        await existing.deleteOne()
        return res.status(200).json(new ApiResponse(200, null, "Comment unliked"))
    } else {
        await Like.create({ comment: commentId, user: userId })
        return res.status(201).json(new ApiResponse(201, null, "Comment liked"))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    const existing = await Like.findOne({ tweet: tweetId, user: userId })
    if (existing) {
        await existing.deleteOne()
        return res.status(200).json(new ApiResponse(200, null, "Tweet unliked"))
    } else {
        await Like.create({ tweet: tweetId, user: userId })
        return res.status(201).json(new ApiResponse(201, null, "Tweet liked"))
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const likes = await Like.find({ user: userId, video: { $exists: true } }).populate("video")
    return res.status(200).json(new ApiResponse(200, likes, "Liked videos fetched"))
})

const isVideoLiked = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const liked = await Like.exists({ video: videoId, likedBy: userId });
    return res.status(200).json(new ApiResponse(200, { liked: !!liked }, "Video like status fetched"));
});

const isCommentLiked = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const liked = await Like.exists({ comment: commentId, likedBy: userId });
    return res.status(200).json(new ApiResponse(200, { liked: !!liked }, "Comment like status fetched"));
});

const isTweetLiked = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const liked = await Like.exists({ tweet: tweetId, likedBy: userId });
    return res.status(200).json(new ApiResponse(200, { liked: !!liked }, "Tweet like status fetched"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    isVideoLiked,
    isCommentLiked,
    isTweetLiked
}
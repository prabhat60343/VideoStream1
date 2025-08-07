import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import OpenAI from "openai";

// ✅ Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Add this in your .env file
});

// ✅ AI moderation function
async function isCommentFlaggedByAI(text) {
    const moderation = await openai.moderations.create({ input: text });
    const result = moderation.results[0];
    return result.flagged; // returns true if content is offensive
}

// ✅ Get video comments
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const comments = await Comment.find({ video: videoId })
        .skip(skip)
        .limit(Number(limit))
        .populate("owner", "fullname username avatar");

    return res.status(200).json({
        statusCode: 200,
        message: "Comments fetched successfully",
        data: comments,
        success: true,
    });
});

// ✅ Add comment with AI moderation
const addComment = asyncHandler(async (req, res, next) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    // 🧠 AI Moderation
    const flagged = await isCommentFlaggedByAI(content);
    if (flagged) {
        throw new ApiError(
            400,
            "🚫 Comment violates community guidelines and was blocked."
        );
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: userId,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "✅ Comment added successfully"));
});

// ✅ Update comment with AI moderation
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    // 🧠 AI Moderation
    const flagged = await isCommentFlaggedByAI(content);
    if (flagged) {
        throw new ApiError(
            400,
            "🚫 Updated comment violates community guidelines and was blocked."
        );
    }

    // Validate commentId as a valid ObjectId (must be 24 hex chars)
    if (
        !mongoose.Types.ObjectId.isValid(commentId) ||
        commentId.length !== 24
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid commentId",
            errors: [],
        });
    }

    const comment = await Comment.findOneAndUpdate(
        { _id: commentId, owner: userId },
        { content },
        { new: true }
    );

    if (!comment) {
        throw new ApiError(404, "Comment not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, comment, "✅ Comment updated successfully")
    );
});

// ✅ Delete comment (no AI needed here)
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?._id;

    // Validate commentId as a valid ObjectId (must be 24 hex chars)
    if (
        !mongoose.Types.ObjectId.isValid(commentId) ||
        commentId.length !== 24
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid commentId",
            errors: [],
        });
    }

    const comment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: userId,
    });

    if (!comment) {
        throw new ApiError(404, "Comment not found or unauthorized");
    }

    return res.status(200).json({
        statusCode: 200,
        message: "✅ Comment deleted successfully",
        data: comment,
        success: true,
    });
});

// ✅ Export all controllers
export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
};
    
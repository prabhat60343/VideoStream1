import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/file_upload.js"
import { summarizeText } from "../utils/summarizer.js"



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    const filter = {};
    if (query) {
        filter.title = { $regex: query, $options: "i" };
    }
    if (userId && isValidObjectId(userId)) {
        filter.owner = userId;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortType === "asc" ? 1 : -1;

    const videos = await Video.find(filter)
        .populate("owner", "fullname username avatar")
        .sort(sortOptions)
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit));

    const total = await Video.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, { videos, total, page: parseInt(page), limit: parseInt(limit) }, "Videos fetched successfully")
    );
})
// Helper function


const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user?._id;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    if (!req.files || !req.files.video) {
        throw new ApiError(400, "Video file is required");
    }

    // Upload video to Cloudinary
    const videoLocalPath = req.files.video[0].path;
    const videoUpload = await uploadOnCloudinary(videoLocalPath, "video");
    if (!videoUpload?.url) {
        throw new ApiError(500, "Video upload failed");
    }
    // Get duration from temp file
    const duration = videoUpload?.duration || 0;

    // Optional: handle thumbnail
    let thumbnailUrl = "";
    if (req.files.thumbnail) {
        const thumbUpload = await uploadOnCloudinary(req.files.thumbnail[0].path, "image");
        thumbnailUrl = thumbUpload?.url || "";
    }
    // Generate AI summary from title + description
    let summary = "";
    try {
        summary = await summarizeText(`${title}. ${description}`);
    } catch (err) {
        console.error("Summary generation failed:", err);
        summary = "Summary not available";
    }

    const video = await Video.create({
        title,
        description,
        summary,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUrl,
        duration,
        owner: userId
    });

    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully with AI-generated summary")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId)
        .populate("owner", "fullname username avatar");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    );
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const { title, description } = req.body;
    let thumbnailUrl = video.thumbnail;

    // Handle thumbnail update if provided
    if (req.files && req.files.thumbnail) {
        const thumbUpload = await uploadOnCloudinary(req.files.thumbnail.tempFilePath, "image");
        if (thumbUpload?.url) {
            thumbnailUrl = thumbUpload.url;
        }
    }

    if (title) video.title = title;
    if (description) video.description = description;
    
    // ✅ Regenerate summary only if description is updated
    try {
        const summary = await summarizeText(description);
        video.summary = summary;
    } catch (err) {
        console.error("Error regenerating summary:", err.message);
    }
    video.thumbnail = thumbnailUrl;

    await video.save();

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    );
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    await video.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "Video deleted successfully")
    );
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.ispublished = !video.ispublished;
    await video.save();

    return res.status(200).json(
        new ApiResponse(200, video, `Video publish status toggled to ${video.ispublished}`)
    );
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,

}
import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
  const channelId = req.user?._id;

  // Total videos
  const totalVideos = await Video.countDocuments({ owner: channelId });

  // Total subscribers
  const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

  // Total video views (assuming Video model has a 'views' field)
  const videos = await Video.find({ owner: channelId }, "views");
  const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);

  // Total likes on all videos
  const videoIds = videos.map(v => v._id);
  const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

  const stats = {
    totalVideos,
    totalSubscribers,
    totalViews,
    totalLikes
  };

  return res.status(200).json(new ApiResponse(200, stats, "Channel stats fetched"));
})

const getChannelVideos = asyncHandler(async (req, res) => {
  const channelId = req.user?._id;
  const videos = await Video.find({ owner: channelId }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched"));
})

export {
  getChannelStats,
  getChannelVideos
}
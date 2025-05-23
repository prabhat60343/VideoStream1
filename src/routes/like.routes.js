import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    isVideoLiked,
    isCommentLiked,
    isTweetLiked,
} from "../controllers/like.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

// Add these routes for checking like status
router.route("/isliked/v/:videoId").get(isVideoLiked);
router.route("/isliked/c/:commentId").get(isCommentLiked);
router.route("/isliked/t/:tweetId").get(isTweetLiked);

export default router
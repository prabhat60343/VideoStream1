import { Router } from "express";
import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

// Get all comments for a video
router.get("/videos/:videoId/comments", getVideoComments);

// Add a comment to a video (requires auth)
router.post("/videos/:videoId/comments", verifyJWT, addComment);

// Update a comment (requires auth)
router.put("/comments/:commentId", verifyJWT, updateComment);

// Delete a comment (requires auth)
router.delete("/comments/:commentId", verifyJWT, deleteComment);

export default router;
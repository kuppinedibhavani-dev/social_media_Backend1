import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createPost, getPosts } from "../controllers/postController.js";

const router = express.Router();

// ALWAYS protect both — because req.user comes from token
router.get("/list", protect, getPosts);
router.post("/create", protect, createPost);

export default router;
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createPost, getPosts } from "../controllers/postController.js";

const router = express.Router();

router.post("/create", verifyToken, createPost);
router.get("/list", verifyToken, getPosts);

export default router;
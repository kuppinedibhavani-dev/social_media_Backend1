import express from "express";
import multer from "multer";
import { supabase } from "../config/supabase.js";

import {
  registerUser,
  loginUser
} from "../controllers/authController.js";

const router = express.Router();

// Multer memory storage (no disk)
const upload = multer({ storage: multer.memoryStorage() });

// REGISTER + LOGIN
router.post("/register", registerUser);
router.post("/login", loginUser);

// ⭐ UPLOAD AVATAR
router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    const file = req.file;
    const userId = req.body.userId;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const ext = file.originalname.split(".").pop();
    const fileName = `avatar_${userId}_${Date.now()}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return res.status(500).json({ error: "Upload failed" });
    }

    // Public URL
    const { data: urlData } = supabase
      .storage
      .from("avatars")
      .getPublicUrl(fileName);

    const avatarUrl = urlData.publicUrl;

    // Update user row in Supabase
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: avatarUrl })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json(updateError);
    }

    res.json({
      message: "Avatar uploaded successfully",
      avatar_url: avatarUrl,
      user: updatedUser,
    });

  } catch (err) {
    console.error("Upload avatar error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
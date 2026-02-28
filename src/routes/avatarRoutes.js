import express from "express";
import multer from "multer";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// Store upload in memory (buffer mode)
const upload = multer({ storage: multer.memoryStorage() });

// ---- Upload Avatar ----
router.post("/upload", upload.single("avatar"), async (req, res) => {
  try {
    const file = req.file;
    const userId = req.body.userId;

    if (!file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Create unique filename
    const ext = file.originalname.split(".").pop();
    const fileName = `avatar_${userId}_${Date.now()}.${ext}`;

    // Upload to Supabase storage - WITH UPSERT
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true, // ⭐ ALLOW REPLACEMENT
      });

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      return res.status(500).json({ error: "Failed to upload image" });
    }

    // Get public URL properly
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const avatarUrl = publicUrlData.publicUrl; // ⭐ Correct path

    // Update user row
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: avatarUrl })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Update Error:", updateError);
      return res.status(500).json({ error: "Failed to update user" });
    }

    res.json({
      message: "Avatar uploaded successfully",
      avatar_url: avatarUrl,
      user: updatedUser,
    });

  } catch (err) {
    console.error("Avatar upload server error:", err);
    res.status(500).json({ error: "Server error uploading avatar" });
  }
  // ---- Update profile info (name/email/password) ----
router.put("/update-profile", async (req, res) => {
  try {
    const { userId, name, email } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .update({ name, email })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Profile update error:", error);
      return res.status(500).json({ error: "Failed to update profile" });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (err) {
    console.error("Update-profile server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
});

export default router;
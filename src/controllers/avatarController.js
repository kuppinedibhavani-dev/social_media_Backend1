import { supabase } from "../config/supabase.js";

export const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.body.userId;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const fileName = `${userId}-${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) return res.status(400).json(uploadError);

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const avatarUrl = data.publicUrl;

    await supabase
      .from("users")
      .update({ avatar_url: avatarUrl })
      .eq("id", userId);

    res.json({ avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
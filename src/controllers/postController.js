import { supabase } from "../config/supabase.js";
export const createPost = async (req, res) => {
  try {
    const userId = req.user;

    const { content, platform, schedule_time } = req.body;

    if (!content || !platform)
      return res.status(400).json({
        success: false,
        message: "content and platform are required",
      });

    const isScheduled = Boolean(schedule_time);

    // Insert post
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          user_id: userId,
          content,
          platform,
          schedule_time,
          status: isScheduled ? "scheduled" : "published",
        },
      ])
      .select();

    if (error) return res.status(400).json({ success: false, error });

    const post = data[0];

    /* ---------------------------------------------------------
       ⭐ CREATE NOTIFICATION FOR THIS USER (Realtime will use it)
    ---------------------------------------------------------- */
    await supabase.from("notifications").insert([
      {
        user_id: userId,
        message: isScheduled
          ? `Scheduled post for ${platform} at ${schedule_time}`
          : `New post published on ${platform}`,
      },
    ]);

    return res.json({
      success: true,
      scheduled: isScheduled,
      message: isScheduled
        ? "Post scheduled successfully"
        : "Post published immediately",
      post,
    });
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
export const getPosts = async (req, res) => {
  try {
    const userId = req.user; // 👈 UUID string directly from middleware

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)          // ✔ correct filter
      .order("created_at", { ascending: false });

    if (error) {
      console.error("SUPABASE GET POSTS ERROR:", error);
      return res.status(400).json({ error });
    }

    return res.json({
      success: true,
      posts: data || [],
    });

  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
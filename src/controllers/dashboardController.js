import { supabase } from "../config/supabase.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user;

    // Total posts
    const total = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Published posts
    const published = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "published");

    // Scheduled posts
    const scheduled = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "scheduled");

    // Upcoming posts (schedule_time > now)
    const upcoming = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gt("schedule_time", new Date().toISOString());

    return res.json({
      success: true,
      stats: {
        totalPosts: total.count,
        publishedPosts: published.count,
        scheduledPosts: scheduled.count,
        upcomingPosts: upcoming.count,
      },
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};
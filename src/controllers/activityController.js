import { supabase } from "../config/supabase.js";

export const getUserActivity = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch latest posts
    const { data: posts } = await supabase
      .from("posts")
      .select("title, status, created_at, schedule_time")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // Fetch analytics activity
    const { data: analytics } = await supabase
      .from("analytics")
      .select("likes, comments, shares, impressions, post_id")
      .order("id", { ascending: false });

    let activities = [];

    // Format Post Activity
    posts?.forEach((post) => {
      activities.push(`📝 Post "${post.title}" was created on ${new Date(post.created_at).toLocaleString()}`);

      if (post.status === "scheduled") {
        activities.push(`⏳ Post "${post.title}" is scheduled for ${new Date(post.schedule_time).toLocaleString()}`);
      } else if (post.status === "published") {
        activities.push(`🚀 Post "${post.title}" was published`);
      }
    });

    // Format Analytics Activity
    analytics?.forEach((a) => {
      activities.push(
        `📊 Post analytics updated — Likes: ${a.likes}, Comments: ${a.comments}, Shares: ${a.shares}`
      );
    });

    // Keep latest 15 activities
    activities = activities.slice(0, 15);

    res.json({ activities });

  } catch (err) {
    console.error("Activity Error:", err);
    res.status(500).json({ message: "Error fetching activity" });
  }
};
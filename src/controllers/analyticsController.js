import { supabase } from "../config/supabase.js";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user;

    const { data, error } = await supabase
      .from("posts")
      .select("platform, status, created_at")
      .eq("user_id", userId);

    if (error) return res.status(400).json({ error });

    // Platform breakdown
    const platformCount = {};
    data.forEach(p => {
      platformCount[p.platform] = (platformCount[p.platform] || 0) + 1;
    });

    // Status breakdown
    const statusCount = {
      scheduled: data.filter(p => p.status === "scheduled").length,
      published: data.filter(p => p.status === "published").length,
    };

    // Posting frequency by date
    const frequency = {};
    data.forEach(p => {
      const date = p.created_at.split("T")[0];
      frequency[date] = (frequency[date] || 0) + 1;
    });

    return res.json({
      success: true,
      analytics: {
        platformCount,
        statusCount,
        postingFrequency: frequency,
      },
    });
  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};
import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // ---- Total Posts ----
    const postsResult = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    const totalPosts = postsResult.count || 0;

    // ---- Scheduled Posts ----
    const scheduledResult = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "scheduled");

    const scheduled = scheduledResult.count || 0;

    // ---- Engagement Score ----
    const { data: analytics = [], error: analyticsError } = await supabase
      .from("analytics")
      .select("engagement_score")
      .limit(50);

    if (analyticsError) console.log("Analytics Error:", analyticsError);

    const engagement =
      analytics.length > 0
        ? Math.round(
            analytics.reduce((a, b) => a + Number(b.engagement_score || 0), 0) /
              analytics.length
          )
        : 0;

    return res.json({
      totalPosts,
      scheduled,
      engagement,
      followers: 5432,
    });
  } catch (err) {
    console.error("Stats route error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
export const createPost = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    // ✔️ Verify token properly
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const realUserId = decoded.sub;

    if (!realUserId) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const { content, platform, schedule_time } = req.body;

    if (!content || !platform) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const isScheduled = Boolean(schedule_time);

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          user_id: realUserId,
          content,
          platform,
          schedule_time: schedule_time || null,
          status: isScheduled ? "scheduled" : "published",
        },
      ])
      .select();

    if (error) return res.status(400).json({ success: false, error });

    res.json({
      success: true,
      message: "Post created",
      post: data[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
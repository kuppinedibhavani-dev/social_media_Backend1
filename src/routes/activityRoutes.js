import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("activity")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  res.json({ activities: data || [] });
});

export default router;
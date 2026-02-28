import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  res.json({ notifications: data || [] });
});

export default router;
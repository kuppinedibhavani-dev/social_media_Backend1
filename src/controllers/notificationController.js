import { supabase } from "../config/supabase.js";

export const getNotifications = async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json(error);

  res.json(data);
};

export const addNotification = async (req, res) => {
  const { userId, message } = req.body;

  const { data, error } = await supabase
    .from("notifications")
    .insert([{ user_id: userId, message }])
    .select();

  if (error) return res.status(400).json(error);

  res.json(data[0]);
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (error) return res.status(400).json(error);

  res.json({ message: "Notification marked as read" });
};
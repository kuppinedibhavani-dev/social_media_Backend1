import { supabase } from "../config/supabase.js";

// ---------------- REGISTER ----------------
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: "http://localhost:5173"
    }
  });

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  // AUTO-CONFIRM (only works if RLS + settings allow)
  await supabase.rpc("confirm_user_email", { user_email: email });

  return res.json({
    success: true,
    message: "Registered successfully",
    userId: data.user.id
  });
};

// ---------------- LOGIN ----------------
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  res.json({
    success: true,
    message: "Login successful",
    token: data.session.access_token,
    userId: data.user.id,
    email: data.user.email
  });
  
};
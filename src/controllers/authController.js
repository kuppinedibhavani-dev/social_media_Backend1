import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password: hash }])
    .select();
    console.log("REGISTER BODY:", req.body);
    console.log("SUPABASE ERROR:", error);

  if (error) return res.status(400).json(error);

  res.json({
    message: "User Registered Successfully",
    token: generateToken(data[0].id),
    user: data[0]
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    message: "Login Successful",
    token: generateToken(user.id),
    user
  });
};
import { supabase } from "../config/supabase.js";

export const subscribeToRealtime = () => {
  const channel = supabase
    .channel("realtime:posts")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "posts" },
      (payload) => {
        console.log("🔴 Realtime Post Change:", payload);
      }
    )
    .subscribe();

  return channel;
};
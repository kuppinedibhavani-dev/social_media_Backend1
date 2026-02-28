import cron from "node-cron";
import { supabase } from "../config/supabase.js";

cron.schedule("* * * * *", async () => {
  const now = new Date().toISOString();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "scheduled")
    .lte("schedule_time", now);

  if (!posts?.length) return;

  for (const post of posts) {
    await supabase
      .from("posts")
      .update({ status: "posted" })
      .eq("id", post.id);

    console.log("Published: ", post.id);
  }
});
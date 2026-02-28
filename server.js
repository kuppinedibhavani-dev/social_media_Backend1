import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/authRoutes.js";
import postRoutes from "./src/routes/postRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";

import "./cronScheduler.js";   
import avatarRoutes from "./src/routes/avatarRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import activityRoutes from "./src/routes/activityRoutes.js";
import statsRoutes from "./src/routes/statsRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/avatar", avatarRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activity",activityRoutes);
app.use("/api/stats",statsRoutes);
app.use("/uploads", express.static("uploads"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

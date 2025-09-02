import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import { handleDemo } from "./routes/demo";
import authRouter from "./routes/auth";
import dreamRouter from "./routes/dream";
import insightsRouter from "./routes/insights";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // Initialize passport (for Google OAuth flows)
  app.use(passport.initialize());

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // API Routers
  app.use("/api/auth", authRouter);
  app.use("/api/dream", dreamRouter);
  app.use("/api/insights", insightsRouter);

  return app;
}

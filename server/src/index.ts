import { config } from "@/config/env"; // Load config first
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "@/config/passport"; // Import passport config
import authRouter from "@/routes/auth.router";
import userRouter from "@/routes/user.router";

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser() as any);

// Initialize Passport - stateless configuration
app.use(passport.initialize());
// No passport.session() needed for stateless approach

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: config.server.environment,
  });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// 404 handler
app.use("*", (_, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Global error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(config.server.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.server.port}`);
  console.log(`📊 Environment: ${config.server.environment}`);
});

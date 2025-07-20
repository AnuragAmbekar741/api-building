// Load environment variables FIRST - before any other imports
import dotenv from "dotenv";
dotenv.config();

// Now import other modules
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "@/routes/auth.router";
import userRouter from "@/routes/user.router";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true, // Enable cookies
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser() as any);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

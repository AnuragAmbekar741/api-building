import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * ✅ Centralized environment configuration
 */
export const config = {
  server: {
    port: parseInt(process.env.PORT || "5050"),
    environment: process.env.NODE_ENV || "development",
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  refreshToken: {
    expirationDays: parseInt(process.env.REFRESH_TOKEN_EXPIRATION_DAYS || "7"),
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || "12"),
  },
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackUrl:
      process.env.GOOGLE_CALLBACK_URL ||
      "http://localhost:5050/api/auth/google/callback",
  },
};

// Validate required environment variables
const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

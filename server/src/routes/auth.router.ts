import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { authenticateToken } from "@/middleware/auth";
import passport from "@/config/passport";
import { config } from "@/config/env";

const router = Router();

// Public routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

// Google OAuth routes - completely stateless
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false, // Explicitly disable sessions
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false, // Stateless authentication
    failureRedirect: `${config.cors.origin}/auth/callback?error=Google authentication failed`,
  }),
  AuthController.googleCallback
);

// Protected routes
router.post("/logout-all", authenticateToken, AuthController.logoutAll);

export default router;

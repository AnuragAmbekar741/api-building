import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { authenticateToken } from "@/middleware/auth";

const router = Router();

// Public routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

// Protected routes
router.post("/logout-all", authenticateToken, AuthController.logoutAll);

export default router;

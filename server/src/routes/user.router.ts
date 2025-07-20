import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { authenticateToken } from "@/middleware/auth";

const router = Router();

router.get("/profile", authenticateToken, UserController.getProfile);

export default router;

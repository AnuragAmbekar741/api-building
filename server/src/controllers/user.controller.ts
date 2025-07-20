import { Response } from "express";
import { UserService } from "@/services/user.service";
import { AuthRequest } from "@/middleware/auth";

export class UserController {
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const user = await UserService.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // ✅ Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        user: userWithoutPassword,
        message: "User profile fetched successfully",
      });
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

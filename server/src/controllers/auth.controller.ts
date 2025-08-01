import { Request, Response } from "express";
import { AuthService } from "@/services/auth.service";
import { RefreshTokenService } from "@/services/refresh-token.service";
import { Cookies } from "@/utils/cookies";
import { AuthRequest } from "@/middleware/auth";
import { UserService } from "@/services/user.service";
import { User } from "@prisma/client";

export class AuthController {
  //register new user
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validation
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          error: "Missing required fields",
          required: ["email", "password", "firstName", "lastName"],
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          error: "Password must be at least 8 characters long",
        });
      }

      // Check if user exists
      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }

      // Register user
      const { user, tokens } = await AuthService.register({
        email,
        password,
        firstName,
        lastName,
      });

      // Set refresh token in cookie
      Cookies.setRefreshToken(res, tokens.refreshToken);

      return res.status(201).json({
        message: "Registration successful",
        user,
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * ✅ Simplified login
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      // Login user
      const { user, tokens } = await AuthService.login(email, password);

      // Set refresh token in cookie
      Cookies.setRefreshToken(res, tokens.refreshToken);

      return res.status(200).json({
        message: "Login successful",
        user,
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * ✅ Google OAuth callback handler - completely stateless
   */
  static async googleCallback(req: Request, res: Response) {
    try {
      const user = req.user as User;

      if (!user) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/auth/callback?error=Authentication failed`
        );
      }

      // Generate tokens using the same flow as regular login
      const { tokens } = await AuthService.googleLogin(user);

      // Set refresh token in cookie
      Cookies.setRefreshToken(res, tokens.refreshToken);

      // Redirect to frontend with access token
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${tokens.accessToken}`;
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google callback error:", error);
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?error=Authentication failed`
      );
    }
  }

  /**
   * ✅ Simplified refresh token
   */
  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          error: "Refresh token required",
          code: "MISSING_REFRESH_TOKEN",
        });
      }

      // Refresh tokens
      const tokens = await AuthService.refreshToken(refreshToken);

      // Set new refresh token in cookie
      Cookies.setRefreshToken(res, tokens.refreshToken);

      return res.status(200).json({
        message: "Tokens refreshed successfully",
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      // Clear invalid cookie
      Cookies.clearRefreshToken(res);

      if (
        error.message.includes("Invalid") ||
        error.message.includes("expired")
      ) {
        return res.status(401).json({
          error: "Invalid or expired refresh token",
          code: "INVALID_REFRESH_TOKEN",
        });
      }

      console.error("Refresh error:", error);
      return res.status(500).json({ error: "Token refresh failed" });
    }
  }

  /**
   * ✅ Simplified logout
   */
  static async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        await RefreshTokenService.revoke(refreshToken);
      }

      Cookies.clearRefreshToken(res);

      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);

      // Still clear cookie
      Cookies.clearRefreshToken(res);
      return res.status(200).json({ message: "Logout completed" });
    }
  }

  /**
   * ✅ Logout all devices
   */
  static async logoutAll(req: AuthRequest, res: Response) {
    const user = req.user as { userId: string; email: string }; // ← type assertion
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      await RefreshTokenService.revokeAllForUser(userId);
      Cookies.clearRefreshToken(res);

      return res.status(200).json({
        message: "Logged out from all devices",
      });
    } catch (error) {
      console.error("Logout all error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

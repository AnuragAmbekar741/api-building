import { Request, Response } from "express";
import { Password } from "@/utils/password";
import { JWTTokens } from "@/utils/token";
import { UserService } from "@/services/user.services";
import { AuthService } from "@/services/token.services";
import { Cookies } from "@/utils/cookies";

export class AuthController {
  // Register a new user
  static async register(req: Request, res: Response) {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await UserService.findUniqueEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await Password.hash(password);
    const user = await UserService.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const accessToken = JWTTokens.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = JWTTokens.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    await AuthService.saveRefreshToken(
      refreshToken,
      user.id,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    );

    Cookies.setRefreshToken(res, refreshToken, 1000 * 60 * 60 * 24 * 7);

    return res.status(201).json({ user, accessToken });
  }

  // Login a user
  static async login(req: Request, res: Response) {
    const { email, password } = req?.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await UserService.findUniqueEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await Password.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = JWTTokens.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = JWTTokens.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    await AuthService.saveRefreshToken(
      refreshToken,
      user.id,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    );

    Cookies.setRefreshToken(res, refreshToken, 1000 * 60 * 60 * 24 * 7);

    return res.status(200).json({ user, accessToken });
  }

  // Refresh a user's access token
  static async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      console.log("No refresh token provided");
      return res.status(401).json({ error: "No refresh token provided" });
    }

    let payload;

    try {
      payload = JWTTokens.verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const user = await UserService.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const tokenRecord = await AuthService.findValidRefreshToken(refreshToken);
    if (!tokenRecord) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = JWTTokens.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    await AuthService.deleteRefreshToken(refreshToken);

    Cookies.clearRefreshTokenCookie(res);

    const newRefreshToken = JWTTokens.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    await AuthService.saveRefreshToken(
      newRefreshToken,
      user.id,
      AuthService.getRefreshTokenExpiration()
    );

    Cookies.setRefreshToken(res, newRefreshToken, 1000 * 60 * 60 * 24 * 7);

    return res.status(200).json({ accessToken: newAccessToken });
  }

  //Logout a user
}

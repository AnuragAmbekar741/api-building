import { Response } from "express";

export class Cookies {
  static clearRefreshTokenCookie(res: Response) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
    });
  }

  static setRefreshToken(res: Response, token: string, maxAge: number) {
    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }
}

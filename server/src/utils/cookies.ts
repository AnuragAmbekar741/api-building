import { Response } from "express";

export class Cookies {
  static clearRefreshToken(res: Response): void {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
    });
  }

  static setRefreshToken(res: Response, token: string): void {
    const maxAge =
      parseInt(process.env.REFRESH_TOKEN_EXPIRATION_DAYS || "7") *
      24 *
      60 *
      60 *
      1000;

    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
      maxAge,
    });
  }
}

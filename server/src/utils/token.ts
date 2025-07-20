import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
}

export class JWTTokens {
  // Use getters instead of static initialization to delay evaluation
  private static get accessTokenSecret(): string {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error(
        "JWT_ACCESS_SECRET must be defined in environment variables"
      );
    }
    return secret;
  }

  private static get refreshTokenSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error(
        "JWT_REFRESH_SECRET must be defined in environment variables"
      );
    }
    return secret;
  }

  private static get accessTokenExpiresIn(): string {
    return process.env.JWT_ACCESS_EXPIRES_IN || "15m";
  }

  private static get refreshTokenExpiresIn(): string {
    return process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  }

  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiresIn,
    } as SignOptions);
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiresIn,
    } as SignOptions);
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
  }

  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
  }

  static decodeToken(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null;
  }
}

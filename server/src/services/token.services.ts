import { prisma } from "@/utils/prisma";
import { RefreshToken } from "@prisma/client";

export class AuthService {
  static async saveRefreshToken(
    token: string,
    userId: string,
    expiresAt: Date
  ): Promise<RefreshToken> {
    return await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
        isRevoked: false,
      },
    });
  }

  static getRefreshTokenExpiration(): Date {
    const daysToExpire = parseInt(process.env.REFRESH_TOKEN_DAYS || "7"); // Default 7 days
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * daysToExpire);
  }

  static async revokeRefreshToken(token: string) {
    return await prisma.refreshToken.update({
      where: { token },
      data: { isRevoked: true },
    });
  }

  static async deleteRefreshToken(token: string) {
    return await prisma.refreshToken.delete({
      where: { token },
    });
  }

  static async findValidRefreshToken(token: string) {
    return await prisma.refreshToken.findUnique({
      where: {
        token,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }
}

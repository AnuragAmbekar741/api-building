import { prisma } from "@/utils/prisma";
import { RefreshToken } from "@prisma/client";

/**
 * ✅ Properly named service for refresh token operations
 */
export class RefreshTokenService {
  /**
   * Calculate expiration date consistently
   */
  static getExpirationDate(): Date {
    const days = parseInt(process.env.REFRESH_TOKEN_EXPIRATION_DAYS || "7");
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  /**
   * Save refresh token with consistent expiration
   */
  static async save(token: string, userId: string): Promise<RefreshToken> {
    return await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt: this.getExpirationDate(),
        isRevoked: false,
      },
    });
  }

  /**
   * Find valid token (not revoked, not expired)
   */
  static async findValid(token: string): Promise<RefreshToken | null> {
    return await prisma.refreshToken.findFirst({
      where: {
        token,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  }

  /**
   * Revoke token (approach 2)
   */
  static async revoke(token: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { token, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  /**
   * Delete token permanently
   */
  static async delete(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  /**
   * Revoke all user tokens
   */
  static async revokeAllForUser(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  /**
   * Cleanup old revoked tokens (maintenance job)
   */
  static async cleanup(olderThanDays: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { isRevoked: true, updatedAt: { lt: cutoffDate } },
          { expiresAt: { lt: new Date() } },
        ],
      },
    });

    return result.count;
  }
}

import { User } from "@prisma/client";
import { UserService } from "./user.service";
import { RefreshTokenService } from "./refresh-token.service";
import { JWTTokens } from "@/utils/token";
import { Password } from "@/utils/password";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  tokens: TokenPair;
}

/**
 * ✅ High-level auth operations
 */
export class AuthService {
  /**
   * Generate token pair and save refresh token to DB
   */
  static async generateTokenPair(
    userId: string,
    email: string
  ): Promise<TokenPair> {
    const accessToken = JWTTokens.generateAccessToken({ userId, email });
    const refreshToken = JWTTokens.generateRefreshToken({ userId, email });

    // Save refresh token to database
    await RefreshTokenService.save(refreshToken, userId);

    return { accessToken, refreshToken };
  }

  /**
   * Register user with tokens
   */
  static async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> {
    // Hash password
    const hashedPassword = await Password.hash(userData.password);

    // Create user
    const user = await UserService.createUser({
      ...userData,
      password: hashedPassword,
    });

    // Generate tokens
    const tokens = await this.generateTokenPair(user.id, user.email);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  }

  /**
   * Login user with tokens
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    // Find user
    const user = await UserService.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isValid = await Password.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // Update last login
    await UserService.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await this.generateTokenPair(user.id, user.email);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  }

  /**
   * Google OAuth login - generates tokens for authenticated Google user
   */
  static async googleLogin(user: User): Promise<AuthResponse> {
    // Update last login
    await UserService.updateLastLogin(user.id);

    // Generate tokens using the same flow as regular login
    const tokens = await this.generateTokenPair(user.id, user.email);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  }

  /**
   * Refresh token rotation
   */
  static async refreshToken(oldToken: string): Promise<TokenPair> {
    // Verify JWT signature
    const payload = JWTTokens.verifyRefreshToken(oldToken);

    // Check database validity
    const tokenRecord = await RefreshTokenService.findValid(oldToken);
    if (!tokenRecord) {
      throw new Error("Invalid or expired refresh token");
    }

    // Revoke old token
    await RefreshTokenService.revoke(oldToken);

    // Generate new token pair
    return await this.generateTokenPair(payload.userId, payload.email);
  }
}

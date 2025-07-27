import { RegisterUser } from "@/types/user";
import { prisma } from "@/utils/prisma";
import { User } from "@prisma/client";

export class UserService {
  static async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  static async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  static async createUser(user: RegisterUser): Promise<User> {
    return await prisma.user.create({
      data: {
        ...user,
        email: user.email.toLowerCase(),
      },
    });
  }

  static async updateUser(userId: string, data: Partial<User>): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  static async findUniqueEmail(email: string): Promise<User | null> {
    return this.findByEmail(email); // Use existing method
  }

  static async updateLastLogin(userId: string): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }
}

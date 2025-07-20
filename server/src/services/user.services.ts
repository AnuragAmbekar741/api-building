import { RegisterUser } from "@/types/user";
import { prisma } from "@/utils/prisma";
import { User } from "@prisma/client";

export class UserService {
  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  static async findById(id: string) {
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

  static async findUniqueEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }
}

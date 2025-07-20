import bcrypt from "bcryptjs";

export class Password {
  private static rounds = parseInt(process.env.BCRYPT_ROUNDS || "12");

  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.rounds);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

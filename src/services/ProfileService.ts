import { injectable } from "inversify";
import { IProfileService } from "../interfaces/IProfileService";
import { PrismaClient, User, UserType } from "@prisma/client";

const prisma = new PrismaClient();

@injectable()
export class ProfileService implements IProfileService {
  // Sign Up Authentication Service
  public async viewProfile(args: { userId: number }): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        id: args.userId,
      },

      include: {
        tenant: true,
        landlord: true,
        transactions: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // Sign In Authentication Service
  public async updateProfile(args: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<User> {
    const user = await prisma.user.update({
      where: {
        id: args.userId,
      },
      data: {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        password: args.password,
      },
    });

    return user;
  }
}

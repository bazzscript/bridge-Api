import { generateAccessToken } from "../utils/authUtils";
import { injectable } from "inversify";
import { IAuthService } from "../interfaces/IAuthService";
import { PrismaClient, User, UserType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

@injectable()
export class AuthService implements IAuthService {
  // Sign Up Authentication Service
  public async signUp(args: {
    userType: UserType;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(args.password, 10);

    let user;

    // If UserType Is LandLord
    if (args.userType === "LANDLORD") {
      user = await prisma.user.create({
        data: {
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          password: hashedPassword,

          userType: args.userType,
          landlord: {
            create: {},
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          password: true,
          userType: true,
          landlord: true,
          tenant: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    }

    // Assume the UserType Is Tenant
    user = await prisma.user.create({
      data: {
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        password: hashedPassword,

        userType: "TENANT",
        tenant: {
          create: {},
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        userType: true,
        landlord: true,
        tenant: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }

  // Sign In Authentication Service
  public async signIn(email: string, password: string): Promise<object> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        userType: true,
        landlord: true,
        tenant: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate Access Token
    const accessToken = generateAccessToken({
      userId: String(user.id),
      userType: user.userType,
    });

    return { accessToken, user };
  }
}

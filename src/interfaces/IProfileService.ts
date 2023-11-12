import { User } from "@prisma/client";

export interface IProfileService {
  viewProfile(args: { userId: number }): Promise<Omit<User, "password">>;
  updateProfile(args: {
    userId: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }): Promise<Omit<User, "password">>;
}

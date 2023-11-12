import { UserType } from "@prisma/client";

export interface IAuthService {
  signUp(args: {
    userType: UserType;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<any>;
  signIn(email: string, password: string): Promise<any>;
}

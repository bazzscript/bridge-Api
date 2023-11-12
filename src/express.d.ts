import { LandLord, Tenant, User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      landlord?: LandLord;
      tenant?: Tenant;
    }
  }
}

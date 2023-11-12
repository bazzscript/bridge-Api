import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { decodeAcessToken } from "../utils/authUtils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let token;
    // Confirm, that the TOKKEN IS IN THE HEADER
    // The token wil  be placed in the authorization header and will have the Bearer prefix, thats why we need to split it and get the token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // i token is empty return error
    if (!token) {
      return res.status(401).send({
        statusCode: 401,
        message: "Invalid Token",
        data: {},
      });
    }

    // Verify and decode the token

    const decoded = decodeAcessToken(token);
    const userId = decoded.userId;
    if (!userId) {
      throw new Error("Invalid Token");
    }
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: Number(userId),
      },
    });

    req.user = user;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(401).send({
      statusCode: 401,
      message: "Invalid Token",
      data: {},
    });
  }
}

export async function checkRoleIsLandLord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const allowedRole = "LANDLORD";

  if (req.user && String(req.user.userType) === allowedRole) {
    const landlord = await prisma.landLord.findUniqueOrThrow({
      where: {
        userId: Number(req.user.id),
      },
    });

    req.landlord = landlord;
    return next();
  } else {
    res.status(403).send({
      statusCode: 403,
      message: "Access Denied: Insufficient permission",
      data: {},
    });
  }
}

export async function checkRoleIsTenant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const allowedRole = "TENANT";

  if (req.user && String(req.user.userType) === allowedRole) {
    const tenant = await prisma.tenant.findUniqueOrThrow({
      where: {
        userId: Number(req.user.id),
      },
    });

    req.tenant = tenant;
    return next();
  } else {
    res.status(403).send({
      statusCode: 403,
      message: "Access Denied: Insufficient permission",
      data: {},
    });
  }
}

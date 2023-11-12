import jwt from "jsonwebtoken";

import { environment } from "../configs/constants";

export function generateAccessToken(payload: Record<string, string>) {
  const token = jwt.sign(payload, environment.JWT.ACCESS_TOKEN_SECRET, {
    expiresIn: "365d",
  });

  return token;
}

export function decodeAcessToken(token: string) {
  const result = jwt.verify(token, environment.JWT.ACCESS_TOKEN_SECRET) as any;
  return result;
}

export function generateAuthToken(payload: Record<string, string>) {
  const token = jwt.sign(payload, environment.JWT.AUTH_TOKEN_SECRET, {
    expiresIn: "10m",
  });

  return token;
}

export function decodeAuthToken(token: string) {
  const result = jwt.verify(token, environment.JWT.AUTH_TOKEN_SECRET) as any;
  return result;
}

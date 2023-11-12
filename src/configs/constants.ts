import * as dotenv from "dotenv";
dotenv.config();

export const environment = {
  APP: {
    PORT: process.env.PORT || 3000,
  },

  JWT: {
    ACCESS_TOKEN_SECRET:
      process.env.ACCESS_TOKEN_SECRET || "access-token-secret",
    REFRESH_TOKEN_SECRET:
      process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret",

    AUTH_TOKEN_SECRET: process.env.AUTH_TOKEN_SECRET || "auth-token-secret",
  },

  AWS: {
    S3: {
      ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
      ACCESS_SECRET: process.env.AWS_S3_ACCESS_SECRET,
      BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    },
  },

  PAYSTACK: {
    PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,
    SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
  }
};

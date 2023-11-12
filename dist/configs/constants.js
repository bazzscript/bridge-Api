"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.environment = {
    APP: {
        PORT: process.env.PORT || 3000,
    },
    JWT: {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "access-token-secret",
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret",
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

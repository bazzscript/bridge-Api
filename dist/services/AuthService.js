"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const authUtils_1 = require("../utils/authUtils");
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
let AuthService = class AuthService {
    // Sign Up Authentication Service
    signUp(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(args.password, 10);
            let user;
            // If UserType Is LandLord
            if (args.userType === "LANDLORD") {
                user = yield prisma.user.create({
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
            user = yield prisma.user.create({
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
        });
    }
    // Sign In Authentication Service
    signIn(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
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
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid credentials");
            }
            // Generate Access Token
            const accessToken = (0, authUtils_1.generateAccessToken)({
                userId: String(user.id),
                userType: user.userType,
            });
            return { accessToken, user };
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)()
], AuthService);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRoleIsTenant = exports.checkRoleIsLandLord = exports.verifyToken = void 0;
const authUtils_1 = require("../utils/authUtils");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let token;
            // Confirm, that the TOKKEN IS IN THE HEADER
            // The token wil  be placed in the authorization header and will have the Bearer prefix, thats why we need to split it and get the token
            if (req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer")) {
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
            const decoded = (0, authUtils_1.decodeAcessToken)(token);
            const userId = decoded.userId;
            if (!userId) {
                throw new Error("Invalid Token");
            }
            const user = yield prisma.user.findUniqueOrThrow({
                where: {
                    id: Number(userId),
                },
            });
            req.user = user;
            return next();
        }
        catch (err) {
            // console.error(err);
            return res.status(401).send({
                statusCode: 401,
                message: "Invalid Token",
                data: {},
            });
        }
    });
}
exports.verifyToken = verifyToken;
function checkRoleIsLandLord(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const allowedRole = "LANDLORD";
        if (req.user && String(req.user.userType) === allowedRole) {
            const landlord = yield prisma.landLord.findUniqueOrThrow({
                where: {
                    userId: Number(req.user.id),
                },
            });
            req.landlord = landlord;
            return next();
        }
        else {
            res.status(403).send({
                statusCode: 403,
                message: "Access Denied: Insufficient permission",
                data: {},
            });
        }
    });
}
exports.checkRoleIsLandLord = checkRoleIsLandLord;
function checkRoleIsTenant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const allowedRole = "TENANT";
        if (req.user && String(req.user.userType) === allowedRole) {
            const tenant = yield prisma.tenant.findUniqueOrThrow({
                where: {
                    userId: Number(req.user.id),
                },
            });
            req.tenant = tenant;
            return next();
        }
        else {
            res.status(403).send({
                statusCode: 403,
                message: "Access Denied: Insufficient permission",
                data: {},
            });
        }
    });
}
exports.checkRoleIsTenant = checkRoleIsTenant;

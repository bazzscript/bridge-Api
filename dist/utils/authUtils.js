"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeAuthToken = exports.generateAuthToken = exports.decodeAcessToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../configs/constants");
function generateAccessToken(payload) {
    const token = jsonwebtoken_1.default.sign(payload, constants_1.environment.JWT.ACCESS_TOKEN_SECRET, {
        expiresIn: "365d",
    });
    return token;
}
exports.generateAccessToken = generateAccessToken;
function decodeAcessToken(token) {
    const result = jsonwebtoken_1.default.verify(token, constants_1.environment.JWT.ACCESS_TOKEN_SECRET);
    return result;
}
exports.decodeAcessToken = decodeAcessToken;
function generateAuthToken(payload) {
    const token = jsonwebtoken_1.default.sign(payload, constants_1.environment.JWT.AUTH_TOKEN_SECRET, {
        expiresIn: "10m",
    });
    return token;
}
exports.generateAuthToken = generateAuthToken;
function decodeAuthToken(token) {
    const result = jsonwebtoken_1.default.verify(token, constants_1.environment.JWT.AUTH_TOKEN_SECRET);
    return result;
}
exports.decodeAuthToken = decodeAuthToken;

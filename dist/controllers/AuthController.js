"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const express_validator_1 = require("express-validator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: "Error:- Bad Request",
                    data: {
                        errors: errors.array(),
                    },
                });
            }
            try {
                const body = req.body;
                const email = body.email;
                const password = body.password;
                const firstName = body.first_name;
                const lastName = body.last_name;
                const userType = body.user_type;
                const newUser = yield this.authService.signUp({
                    email,
                    firstName,
                    lastName,
                    password,
                    userType,
                });
                delete newUser.password;
                return res.status(201).json({
                    success: true,
                    statusCode: 201,
                    message: "sign up successfull",
                    data: {
                        user: newUser,
                    },
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: error.message,
                    data: {},
                });
            }
        });
    }
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: "Error:- Bad Request",
                    data: {
                        errors: errors.array(),
                    },
                });
            }
            try {
                const data = yield this.authService.signIn(req.body.email, req.body.password);
                delete data.user.password;
                return res.status(200).json({
                    success: true,
                    statusCode: 200,
                    message: "sign in successfull",
                    data: {
                        accessToken: data.accessToken,
                        user: data.user,
                    },
                });
            }
            catch (error) {
                return res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: "Invalid credentials",
                    data: {},
                });
            }
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, inversify_express_utils_1.httpPost)("/signup", 
    // Validate and sanitize fields.
    (0, express_validator_1.body)("email").isEmail().normalizeEmail(), (0, express_validator_1.body)("password").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    }), (0, express_validator_1.body)("first_name").isString().not().isEmpty().trim().escape(), (0, express_validator_1.body)("last_name").isString().not().isEmpty().trim().escape(), (0, express_validator_1.body)("user_type")
        .isString()
        .toUpperCase()
        .isIn(["LANDLORD", "TENANT"])
        .not()
        .isEmpty()),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)("/signin", (0, express_validator_1.body)("email").isEmail().normalizeEmail(), (0, express_validator_1.body)("password").isStrongPassword({ minLength: 8 })),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
exports.AuthController = AuthController = __decorate([
    (0, inversify_express_utils_1.controller)("/auth"),
    __param(0, (0, inversify_1.inject)("IAuthService")),
    __metadata("design:paramtypes", [Object])
], AuthController);

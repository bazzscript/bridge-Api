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
exports.PaymentController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const express_validator_1 = require("express-validator");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    initializePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        statusCode: 401,
                        message: "Unauthorized Error:- Internal Server Error",
                        data: {},
                    });
                }
                const bidId = Number(req.params.bid_id);
                if (!bidId) {
                    return res.status(400).json({
                        success: false,
                        statusCode: 400,
                        message: "Bid Id is Required",
                        data: {},
                    });
                }
                const payment = yield this.paymentService.initializePaymentWithPaystack({
                    bidId,
                    userId: user.id,
                });
                return res.status(201).json({
                    success: true,
                    statusCode: 201,
                    message: "Payment Initialized successfully",
                    data: Object.assign({}, payment),
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
    verifyPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                const user = req.user;
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        statusCode: 401,
                        message: "Unauthorized Error:- Internal Server Error",
                        data: {},
                    });
                }
                const bidId = Number(req.params.bid_id);
                if (!bidId) {
                    return res.status(400).json({
                        success: false,
                        statusCode: 400,
                        message: "Bid Id is Required",
                        data: {},
                    });
                }
                const transactionReference = req.body.transaction_reference;
                const payment = yield this.paymentService.verifyPaymentWithPaystack({
                    transactionReference,
                });
                return res.status(201).json({
                    success: true,
                    statusCode: 201,
                    message: "Payment Verified successfully",
                    data: Object.assign({}, payment),
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
};
exports.PaymentController = PaymentController;
__decorate([
    (0, inversify_express_utils_1.httpPost)("/initialize_payment", authMiddleware_1.verifyToken, authMiddleware_1.checkRoleIsTenant),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "initializePayment", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)("/verify_payment", (0, express_validator_1.body)("transaction_reference").isString().trim(), authMiddleware_1.verifyToken, authMiddleware_1.checkRoleIsTenant),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "verifyPayment", null);
exports.PaymentController = PaymentController = __decorate([
    (0, inversify_express_utils_1.controller)("/bid/:bid_id"),
    __param(0, (0, inversify_1.inject)("IPaymentService")),
    __metadata("design:paramtypes", [Object])
], PaymentController);

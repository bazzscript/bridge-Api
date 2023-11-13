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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const paymentHelpers_1 = require("../helpers/paymentHelpers");
const prisma = new client_1.PrismaClient();
let PaymentService = class PaymentService {
    // INITIALIZE PAYMENT FOR A BID
    initializePaymentWithPaystack(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                // Confirm Bid Exixts
                const bid = yield tx.bid.findUniqueOrThrow({
                    where: {
                        id: args.bidId,
                    },
                    include: {
                        tenant: {
                            include: {
                                user: true,
                            },
                        },
                        property: {
                            include: {
                                landLord: {
                                    include: {
                                        user: true,
                                    },
                                },
                            },
                        },
                        landLord: {
                            include: {
                                user: true,
                            },
                        },
                    },
                });
                // Confirm Bid Has Been Accepted
                if (bid.accepted === false) {
                    throw new Error("Bid must be accepted to proceed with payment");
                }
                // Confirm Property Associated With the Bid has not already been sold
                const property = yield tx.property.findUniqueOrThrow({
                    where: {
                        id: bid.propertyId,
                    },
                });
                if (property.sold === true) {
                    throw new Error("Property has already been sold");
                }
                // Confirm User With Id Actually Exists
                const user = yield tx.user.findUniqueOrThrow({
                    where: {
                        id: args.userId,
                    },
                    include: {
                        tenant: true,
                    },
                });
                // Confirm User is the tenant associated with bid
                if (((_a = user.tenant) === null || _a === void 0 ? void 0 : _a.id) !== bid.tenantId) {
                    throw new Error("Forbidden:- User is not the tenant associated with bid");
                }
                // Confirm User has an email associated with account
                const payerEmail = user.email;
                if (!payerEmail) {
                    throw new Error("User has no email associated with account");
                }
                let amountToBePayed = Number(bid.bidAmount);
                if (bid.counterBidAmount && Number(bid.counterBidAmount) > 0) {
                    amountToBePayed = Number(bid.counterBidAmount);
                }
                const payerName = user.firstName + " " + user.lastName;
                const payerUserId = (_b = bid.tenant) === null || _b === void 0 ? void 0 : _b.user.id;
                const payeeUserId = bid.property.landLord.user.id;
                if (!payeeUserId || !payerUserId) {
                    throw new Error("Problem with payment");
                }
                // Initialize Paystack Payment
                const paystack = yield paymentHelpers_1.PaystackHelpers.initializeTransaction({
                    amount: amountToBePayed,
                    name: payerName,
                    email: payerEmail,
                });
                const ref = paystack.data.reference;
                // Create A Transaction
                const transaction = yield tx.transaction.create({
                    data: {
                        payerUserId,
                        payeeUserId,
                        amount: amountToBePayed,
                        bidId: bid.id,
                        transactionReference: ref,
                        transactionStatus: "PENDING",
                    },
                });
                // Return transaction with paystack payment url
                return {
                    payment_info: paystack.data,
                    transaction,
                };
            }));
            return query;
        });
    }
    // VERIFY PAYMENT FOR A BID
    verifyPaymentWithPaystack(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Check If Transaction Reference Exists
                const transaction = yield tx.transaction.findUniqueOrThrow({
                    where: {
                        transactionReference: args.transactionReference,
                    },
                    include: {
                        bid: {
                            include: {
                                property: true,
                            },
                        },
                    },
                });
                // Query Paystack to confirm trnasaction was succefull
                const paystack = yield paymentHelpers_1.PaystackHelpers.verifyTransaction(transaction.transactionReference);
                const transactionStatus = paystack.data.status;
                if (transactionStatus === "abandoned") {
                    throw new Error("Payment was not completed");
                }
                if (transactionStatus !== "success") {
                    throw new Error("Payment was not completed");
                }
                // if it is successful update transaction to sucessful
                let transactionUpdated;
                if (transactionStatus === "success") {
                    // if it is successful update transaction to sucessful
                    transactionUpdated = yield tx.transaction.update({
                        where: {
                            id: transaction.id,
                        },
                        data: {
                            transactionStatus: "SUCCESSFULL",
                        },
                    });
                    const propertyId = transaction.bid.propertyId;
                    if (!propertyId) {
                        throw new Error("Problem with payment");
                    }
                    // update property to sold
                    yield tx.property.update({
                        where: {
                            id: propertyId,
                        },
                        data: {
                            sold: true,
                            soldPrice: Number(transaction.amount),
                        },
                    });
                }
                return {
                    // paystack,
                    transaction: transactionUpdated,
                };
            }));
            return query;
        });
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, inversify_1.injectable)()
], PaymentService);

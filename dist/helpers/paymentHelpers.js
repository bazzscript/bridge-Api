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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackHelpers = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../configs/constants");
const MySecretKey = `Bearer ${constants_1.environment.PAYSTACK.SECRET_KEY}`;
// const PAYSTACK_CALLBACK_URL = environment.PAYSTACK.CALLBACK_URL;
class PaystackHelpers {
    /**
     * @description initialize transaction
     */
    static initializeTransaction(args) {
        return __awaiter(this, void 0, void 0, function* () {
            // Adjust the return type based on what you expect from Paystack
            const { email, amount } = args;
            if (!email) {
                throw new Error("Email is required for the payment process");
            }
            if (amount <= 0) {
                throw new Error("Amount must be greater than 0 for the payment process");
            }
            const transactionAmount = amount * 100; // Convert to subunit
            try {
                const response = yield axios_1.default.post("https://api.paystack.co/transaction/initialize", {
                    email,
                    amount: transactionAmount,
                    currency: "NGN",
                    channels: ["card", "ussd", "mobile_money", "bank_transfer"],
                    metadata: { full_name: args.name },
                }, {
                    headers: {
                        Authorization: MySecretKey,
                        "Content-Type": "application/json",
                    },
                });
                const data = response.data;
                console.log(data);
                return data;
            }
            catch (error) {
                // Handle or throw the error
                throw error;
            }
        });
    }
    /**
     * @description verify transaction
     */
    static verifyTransaction(ref) {
        return __awaiter(this, void 0, void 0, function* () {
            // Adjust return type as needed
            try {
                const response = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`, {
                    headers: {
                        Authorization: MySecretKey,
                        "Content-Type": "application/json",
                    },
                });
                const data = response.data;
                console.log(data);
                return data;
            }
            catch (error) {
                // Handle or throw the error as appropriate
                throw error;
            }
        });
    }
}
exports.PaystackHelpers = PaystackHelpers;

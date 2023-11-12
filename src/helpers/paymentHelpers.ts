import axios from "axios";

import { environment } from "../configs/constants";

const MySecretKey = `Bearer ${environment.PAYSTACK.SECRET_KEY}`;
// const PAYSTACK_CALLBACK_URL = environment.PAYSTACK.CALLBACK_URL;

export class PaystackHelpers {
  /**
   * @description initialize transaction
   */

  static async initializeTransaction(args: {
    email: string;
    amount: number;
    name: string;
  }): Promise<any> {
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
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email,
          amount: transactionAmount,
          currency: "NGN",
          channels: ["card", "ussd", "mobile_money", "bank_transfer"],
          metadata: { full_name: args.name },
        },
        {
          headers: {
            Authorization: MySecretKey,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      // Handle or throw the error
      throw error;
    }
  }

  /**
   * @description verify transaction
   */
  static async verifyTransaction(ref: string): Promise<any> {
    // Adjust return type as needed
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`,
        {
          headers: {
            Authorization: MySecretKey,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      // Handle or throw the error as appropriate
      throw error;
    }
  }
}

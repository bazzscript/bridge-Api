import { injectable } from "inversify";
import { IPaymentService } from "../interfaces/IPaymentService";
import { PrismaClient } from "@prisma/client";
import { PaystackHelpers } from "../helpers/paymentHelpers";

const prisma = new PrismaClient();

@injectable()
export class PaymentService implements IPaymentService {
  // INITIALIZE PAYMENT FOR A BID
  public async initializePaymentWithPaystack(args: {
    bidId: number;
    userId: number;
  }): Promise<any> {
    const query = await prisma.$transaction(async (tx) => {
      // Confirm Bid Exixts
      const bid = await tx.bid.findUniqueOrThrow({
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
      const property = await tx.property.findUniqueOrThrow({
        where: {
          id: bid.propertyId,
        },
      });

      if (property.sold === true) {
        throw new Error("Property has already been sold");
      }
      // Confirm User With Id Actually Exists
      const user = await tx.user.findUniqueOrThrow({
        where: {
          id: args.userId,
        },
        include: {
          tenant: true,
        },
      });
      // Confirm User is the tenant associated with bid
      if (user.tenant?.id !== bid.tenantId) {
        throw new Error(
          "Forbidden:- User is not the tenant associated with bid"
        );
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
      const payerUserId = bid.tenant?.user.id!;
      const payeeUserId = bid.property.landLord.user.id!;
      console.log(payerName, payerUserId, payeeUserId, amountToBePayed);
      if (!payeeUserId || !payerUserId) {
        throw new Error("Problem with payment");
      }

      // Initialize Paystack Payment
      const paystack = await PaystackHelpers.initializeTransaction({
        amount: amountToBePayed,
        name: payerName,
        email: payerEmail,
      });

      const ref = paystack.data.reference;
      console.log(ref);
      // Create A Transaction
      const transaction = await tx.transaction.create({
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
    });

    return query;
  }

  // VERIFY PAYMENT FOR A BID
  //   public async verifyPaymentWithPaystack(args: {
  //     transactionReference: string;
  //   }): Promise<any> {}
}

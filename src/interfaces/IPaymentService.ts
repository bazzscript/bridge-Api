export interface IPaymentService {
  // INITIALIZE PAYMENT FOR A BID
  initializePaymentWithPaystack(args: {
    bidId: number;
    userId: number;
  }): Promise<any>;

  // VERIFY PAYMENT FOR A BID
  verifyPaymentWithPaystack(args: {
    transactionReference: string;
  }): Promise<any>;

  // CONFIRM PAYMENT FOR A BID
  // WEBHOOK TO AUTOMATICALLY CONFIRM PAYMENT FOR A BID
}

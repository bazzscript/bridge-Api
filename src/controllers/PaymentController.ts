import { Request, Response } from "express";
import {
  controller,
  httpPost,
  response,
  request,
  httpGet,
  httpPut,
} from "inversify-express-utils";
import { inject } from "inversify";
import { checkRoleIsTenant, verifyToken } from "../middlewares/authMiddleware";
import { IPaymentService } from "../interfaces/IPaymentService";

@controller("/bid/:bid_id")
export class PaymentController {
  constructor(
    @inject("IPaymentService") private paymentService: IPaymentService
  ) {}

  @httpPost(
    "/initialize_payment",

    verifyToken,
    checkRoleIsTenant
  )
  public async initializePayment(
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
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

      const payment = await this.paymentService.initializePaymentWithPaystack({
        bidId,
        userId: user.id,
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Payment Initialized successfully",
        data: {
          ...payment,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: error.message,
        data: {},
      });
    }
  }
}

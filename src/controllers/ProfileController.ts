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
import { IProfileService } from "../interfaces/IProfileService";
import { body, validationResult } from "express-validator";
import { verifyToken } from "../middlewares/authMiddleware";

@controller("/profile")
export class ProfileController {
  constructor(
    @inject("IProfileService") private profileService: IProfileService
  ) {}

  @httpGet("/", verifyToken)
  public async viewProfile(
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
      const userProfile = await this.profileService.viewProfile({
        userId: user.id,
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: "user profile returned successfully",
        data: {
          user: userProfile,
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

  @httpPut(
    "/update",

    body("email").optional().isEmail().normalizeEmail(),
    body("first_name").optional().isString().not().isEmpty().trim().escape(),
    body("last_name").optional().isString().not().isEmpty().trim().escape(),

    verifyToken
  )
  public async updateProfile(
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    const errors = validationResult(req);
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

    try {
      const body = req.body;
      const email = body.email;
      const firstName = body.first_name;
      const lastName = body.last_name;

      const userUpdated = await this.profileService.updateProfile({
        userId: user.id,
        email,
        firstName,
        lastName,
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Update successfull",
        data: {
          user: userUpdated,
        },
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Invalid credentials",
        data: {},
      });
    }
  }
}

import { Request, Response } from "express";
import {
  controller,
  httpPost,
  response,
  request,
} from "inversify-express-utils";
import { inject } from "inversify";
import { IAuthService } from "../interfaces/IAuthService";
import { body, validationResult } from "express-validator";

@controller("/auth")
export class AuthController {
  constructor(@inject("IAuthService") private authService: IAuthService) {}

  @httpPost(
    "/signup",
    // Validate and sanitize fields.
    body("email").isEmail().normalizeEmail(),
    body("password").isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    }),
    body("first_name").isString().not().isEmpty().trim().escape(),
    body("last_name").isString().not().isEmpty().trim().escape(),
    body("user_type")
      .isString()
      .toUpperCase()
      .isIn(["LANDLORD", "TENANT"])
      .not()
      .isEmpty()
  )
  public async signUp(
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

    try {
      const body = req.body;
      const email = body.email;
      const password = body.password;
      const firstName = body.first_name;
      const lastName = body.last_name;
      const userType = body.user_type;
      const newUser = await this.authService.signUp({
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
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: error.message,
        data: {},
      });
    }
  }

  @httpPost(
    "/signin",
    body("email").isEmail().normalizeEmail(),
    body("password").isStrongPassword({ minLength: 8 })
  )
  public async signIn(
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

    try {
      const data = await this.authService.signIn(
        req.body.email,
        req.body.password
      );

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

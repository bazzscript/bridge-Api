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
import { IPropertyService } from "../interfaces/IPropertyService";
import { body, validationResult } from "express-validator";
import {
  checkRoleIsLandLord,
  checkRoleIsTenant,
  verifyToken,
} from "../middlewares/authMiddleware";
import StorageService from "../helpers/storageHelpers";
import validator from "validator";

@controller("/property")
export class PropertyController {
  constructor(
    @inject("IPropertyService") private propertyService: IPropertyService
  ) {}

  // UPLOAD PROPERTY
  @httpPost(
    "/",
    body("price").isNumeric(),
    body("address").isString(),
    body("number_of_rooms").isNumeric(),
    body("amenities").isArray(),
    body("media_urls")
      .isArray()
      .withMessage("media_urls must be an array")
      .notEmpty()
      .withMessage("media_urls should not be empty")
      .bail() // Stop running validations if the above checks fail
      .custom((mediaUrls) =>
        mediaUrls.every((url: string) => validator.isURL(url))
      )
      .withMessage("media_urls must contain valid URLs"),
    // AUTHORIZATION
    verifyToken,
    checkRoleIsLandLord
  )
  public async createProperty(
    @request() req: any,
    @response() res: Response
  ): Promise<Response> {
    try {
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

      const landlord = req.landlord;
      const landlordId = landlord?.id;

      if (!landlord || !landlordId) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: "Unauthorized Error:- Internal Server Error",
          data: {},
        });
      }

      const body = req.body;
      const price = body.price;
      const address = body.address;
      const numberOfRooms = body.number_of_rooms;
      const amenities = body.amenities;
      const mediaUrls = body.media_urls || [];

      const property = await this.propertyService.createProperty({
        landlordId,
        price,
        address,
        numberOfRooms,
        amenities,
        mediaUrls,
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: "property added successfully",
        data: {
          property,
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

  // UPLOAD PROPERTY MEDIAS
  @httpPost(
    "/upload_medias",

    // verifyToken,

    StorageService.uploadMedia.array("medias", 10)

    // verifyToken,
  )
  public async uploadImages(
    @request() req: any,
    @response() res: Response
  ): Promise<Response> {
    try {
      let mediaUrls = [];

      // Images Upload
      const images = req.files;
      if (images && images.length > 0) {
        if (Array.isArray(images)) {
          mediaUrls = images.map((image) => image.location);
        }

        console.log(mediaUrls);
      }

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: "property images uploaded successfully",
        data: {
          mediaUrls,
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

  // GET LIST OF PROPERTIES
  @httpGet(
    "/listing",

    verifyToken
  )
  public async getPropertiesListing(
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    const user = req.user;
    const userId = user?.id;

    if (!user || !userId) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Unauthorized Error:- Internal Server Error",
        data: {},
      });
    }

    try {
      const properties = await this.propertyService.getPropertyListings();

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: "properties fetched successfully",
        data: {
          properties,
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

  // BIDDINGS
  // Accept a Bid
  @httpPut(
    "/:property_id/bids/:bid_id/accept",
    body("counter_bid_amount").isNumeric(),
    verifyToken
  )
  public async acceptABid(
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    const user = req.user;
    const userId = user?.id;

    if (!user || !userId) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Unauthorized Error:- Internal Server Error",
        data: {},
      });
    }

    const propertyId = +req.params.property_id;
    const bidId = +req.params.bid_id;
    if (!propertyId || !bidId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Property Id & Bid Id is Required",
        data: {},
      });
    }

    const body = req.body;
    const counterBidAmount = body.counter_bid_amount;
    try {
      const bid = await this.propertyService.acceptABid({
        bidId,
        propertyId,
        userId,
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Bid Accepted successfully",
        data: {
          bid,
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

  // Reject a Bid
  @httpPut(
    "/:property_id/bids/:bid_id/reject",
    body("counter_bid_amount").isNumeric(),
    verifyToken
  )
  public async rejectABid(
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    const user = req.user;
    const userId = user?.id;

    if (!user || !userId) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Unauthorized Error:- Internal Server Error",
        data: {},
      });
    }

    const propertyId = +req.params.property_id;
    const bidId = +req.params.bid_id;
    if (!propertyId || !bidId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Property Id & Bid Id is Required",
        data: {},
      });
    }

    const body = req.body;
    const counterBidAmount = body.counter_bid_amount;
    try {
      const bid = await this.propertyService.rejectABid({
        bidId,
        userId,
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Bid rejected successfully",
        data: {
          bid,
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

  // Create A Bid
  @httpPost(
    "/:property_id/bids",
    body("bid_amount").isNumeric(),
    verifyToken,
    checkRoleIsTenant
  )
  public async createBidding(
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

    const tenant = req.tenant;
    const tenantId = tenant?.id;

    if (!tenant || !tenantId) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Unauthorized Error:- Internal Server Error",
        data: {},
      });
    }

    const propertyId = req.params.property_id;
    if (!propertyId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Property Id is Required",
        data: {},
      });
    }

    const body = req.body;
    const bidAmount = body.bid_amount;
    try {
      const bid = await this.propertyService.createBidding({
        propertyId: Number(propertyId),
        amount: Number(bidAmount),
        tenantId: tenantId,
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Bid made successfully",
        data: {
          bid,
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

  // Create a counter bid
  @httpPost(
    "/:property_id/bids/:bid_id/counter_bid",
    body("counter_bid_amount").isNumeric(),
    verifyToken,
    checkRoleIsLandLord
  )
  public async createCounterBidding(
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

    const landlord = req.landlord;
    const landlordId = landlord?.id;

    if (!landlord || !landlordId) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Unauthorized Error:- Internal Server Error",
        data: {},
      });
    }

    const propertyId = +req.params.property_id;
    const bidId = +req.params.bid_id;
    if (!propertyId || !bidId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Property Id & Bid Id is Required",
        data: {},
      });
    }

    const body = req.body;
    const counterBidAmount = body.counter_bid_amount;
    try {
      const bid = await this.propertyService.createCounterBidding({
        bidId: Number(bidId),
        landlordId: landlordId,
        counterAmount: counterBidAmount,
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Bid countered successfully",
        data: {
          bid,
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

  // Get All Bids On A Property
  @httpGet("/:property_id/bids", verifyToken)
  public async getPropertyBiddings(
    @request() req: Request,
    @response() res: Response
  ): Promise<Response> {
    const user = req.user;
    const userId = user?.id;

    if (!user || !userId) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Unauthorized Error:- Internal Server Error",
        data: {},
      });
    }

    const propertyId = +req.params.property_id;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Property Id is Required",
        data: {},
      });
    }

    try {
      const biddings = await this.propertyService.getPropertyBiddings({
        propertyId: propertyId,
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Property biddings returned successfully",
        data: {
          biddings,
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

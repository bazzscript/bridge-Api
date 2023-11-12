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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middlewares/authMiddleware");
// import StorageService from "../helpers/storageHelpers";
const validator_1 = __importDefault(require("validator"));
let PropertyController = class PropertyController {
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    // UPLOAD PROPERTY
    createProperty(req, res) {
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
                const landlord = req.landlord;
                const landlordId = landlord === null || landlord === void 0 ? void 0 : landlord.id;
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
                const property = yield this.propertyService.createProperty({
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
    // UPLOAD PROPERTY MEDIAS
    // @httpPost(
    //   "/upload_medias",
    //   // verifyToken,
    //   StorageService.uploadMedia.array("medias", 10)
    //   // verifyToken,
    // )
    // public async uploadImages(
    //   @request() req: any,
    //   @response() res: Response
    // ): Promise<Response> {
    //   try {
    //     let mediaUrls = [];
    //     // Images Upload
    //     const images = req.files;
    //     if (images && images.length > 0) {
    //       if (Array.isArray(images)) {
    //         mediaUrls = images.map((image) => image.location);
    //       }
    //       console.log(mediaUrls);
    //     }
    //     return res.status(201).json({
    //       success: true,
    //       statusCode: 201,
    //       message: "property images uploaded successfully",
    //       data: {
    //         mediaUrls,
    //       },
    //     });
    //   } catch (error: any) {
    //     return res.status(400).json({
    //       success: false,
    //       statusCode: 400,
    //       message: error.message,
    //       data: {},
    //     });
    //   }
    // }
    // GET LIST OF PROPERTIES
    getPropertiesListing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const userId = user === null || user === void 0 ? void 0 : user.id;
            if (!user || !userId) {
                return res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: "Unauthorized Error:- Internal Server Error",
                    data: {},
                });
            }
            try {
                const properties = yield this.propertyService.getPropertyListings();
                return res.status(201).json({
                    success: true,
                    statusCode: 201,
                    message: "properties fetched successfully",
                    data: {
                        properties,
                    },
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
    // BIDDINGS
    // Accept a Bid
    acceptABid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const userId = user === null || user === void 0 ? void 0 : user.id;
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
                const bid = yield this.propertyService.acceptABid({
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
    // Reject a Bid
    rejectABid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const userId = user === null || user === void 0 ? void 0 : user.id;
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
                const bid = yield this.propertyService.rejectABid({
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
    // Create A Bid
    createBidding(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const tenant = req.tenant;
            const tenantId = tenant === null || tenant === void 0 ? void 0 : tenant.id;
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
                const bid = yield this.propertyService.createBidding({
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
    // Create a counter bid
    createCounterBidding(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const landlord = req.landlord;
            const landlordId = landlord === null || landlord === void 0 ? void 0 : landlord.id;
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
                const bid = yield this.propertyService.createCounterBidding({
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
    // Get All Bids On A Property
    getPropertyBiddings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const userId = user === null || user === void 0 ? void 0 : user.id;
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
                const biddings = yield this.propertyService.getPropertyBiddings({
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
exports.PropertyController = PropertyController;
__decorate([
    (0, inversify_express_utils_1.httpPost)("/", (0, express_validator_1.body)("price").isNumeric(), (0, express_validator_1.body)("address").isString(), (0, express_validator_1.body)("number_of_rooms").isNumeric(), (0, express_validator_1.body)("amenities").isArray(), (0, express_validator_1.body)("media_urls")
        .isArray()
        .withMessage("media_urls must be an array")
        .notEmpty()
        .withMessage("media_urls should not be empty")
        .bail() // Stop running validations if the above checks fail
        .custom((mediaUrls) => mediaUrls.every((url) => validator_1.default.isURL(url)))
        .withMessage("media_urls must contain valid URLs"), 
    // AUTHORIZATION
    authMiddleware_1.verifyToken, authMiddleware_1.checkRoleIsLandLord),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "createProperty", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/listing", authMiddleware_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertiesListing", null);
__decorate([
    (0, inversify_express_utils_1.httpPut)("/:property_id/bids/:bid_id/accept", (0, express_validator_1.body)("counter_bid_amount").isNumeric(), authMiddleware_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "acceptABid", null);
__decorate([
    (0, inversify_express_utils_1.httpPut)("/:property_id/bids/:bid_id/reject", (0, express_validator_1.body)("counter_bid_amount").isNumeric(), authMiddleware_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "rejectABid", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)("/:property_id/bids", (0, express_validator_1.body)("bid_amount").isNumeric(), authMiddleware_1.verifyToken, authMiddleware_1.checkRoleIsTenant),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "createBidding", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)("/:property_id/bids/:bid_id/counter_bid", (0, express_validator_1.body)("counter_bid_amount").isNumeric(), authMiddleware_1.verifyToken, authMiddleware_1.checkRoleIsLandLord),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "createCounterBidding", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/:property_id/bids", authMiddleware_1.verifyToken),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertyBiddings", null);
exports.PropertyController = PropertyController = __decorate([
    (0, inversify_express_utils_1.controller)("/property"),
    __param(0, (0, inversify_1.inject)("IPropertyService")),
    __metadata("design:paramtypes", [Object])
], PropertyController);

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
exports.PropertyService = void 0;
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let PropertyService = class PropertyService {
    createProperty(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const property = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Confirm Landlord With Id Exists
                const landlord = yield tx.landLord.findUniqueOrThrow({
                    where: {
                        id: args.landlordId,
                    },
                });
                // Create Property
                const property = yield tx.property.create({
                    data: {
                        price: args.price,
                        address: args.address,
                        amenities: args.amenities,
                        numberOfRooms: args.numberOfRooms,
                        mediaUrls: args.mediaUrls,
                        landLord: {
                            connect: {
                                id: landlord.id,
                            },
                        },
                    },
                });
                return property;
            }));
            return property;
        });
    }
    getPropertyListings() {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = yield prisma.property.findMany({
                include: {
                    landLord: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                },
            });
            return properties;
        });
    }
    // BIDDING WAR
    // Create Bidding For A Property
    createBidding(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const bid = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Confirm Tenant Actually Exists
                const tenant = yield tx.tenant.findUniqueOrThrow({
                    where: {
                        id: args.tenantId,
                    },
                });
                // Confirm Property With Id Actually Exists
                const property = yield tx.property.findUniqueOrThrow({
                    where: {
                        id: args.propertyId,
                    },
                });
                if (property.sold) {
                    throw new Error("Property has already been sold");
                }
                // Create a new bid
                const bid = yield tx.bid.create({
                    data: {
                        tenantId: tenant.id,
                        propertyId: property.id,
                        bidAmount: args.amount,
                    },
                });
                return bid;
            }));
            return bid;
        });
    }
    // Create Counter Bid
    createCounterBidding(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const counterBid = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Confirm Landlord Actually Exists
                const landlord = yield tx.landLord.findUniqueOrThrow({
                    where: {
                        id: args.landlordId,
                    },
                });
                // Counter Bid
                // Confirm there is a bid to actually be countered
                const bid = yield tx.bid.findUniqueOrThrow({
                    where: {
                        id: args.bidId,
                    },
                });
                if (!bid.bidAmount && !bid.tenantId) {
                    throw new Error("A tenant has to make a bid first, before it can be countered");
                }
                // make a counter bid
                const counterBid = yield tx.bid.update({
                    where: {
                        id: bid.id,
                    },
                    data: {
                        landLordId: landlord.id,
                        counterBidAmount: args.counterAmount,
                    },
                });
                return counterBid;
            }));
            return counterBid;
        });
    }
    // Get All Bids On A Property
    getPropertyBiddings(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const biddings = yield prisma.bid.findMany({
                where: {
                    propertyId: args.propertyId,
                },
            });
            return biddings;
        });
    }
    // Accept A Bid
    // Once a Bid is Accepted Make Sure That The Landlord Cant Accept ANother Bid For The Same Property
    acceptABid(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const bid = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const propertyBiddings = yield tx.bid.findMany({
                    where: {
                        propertyId: args.propertyId,
                    },
                });
                if (propertyBiddings.some((bid) => bid.accepted === true)) {
                    throw new Error("A bid on this property has already been accepted, you cant accept another one");
                }
                // Accept A Bid
                const acceptBid = yield tx.bid.update({
                    where: {
                        id: args.bidId,
                    },
                    data: {
                        accepted: true,
                        acceptedByUser: {
                            connect: {
                                id: args.userId,
                            },
                        },
                        rejectedByUser: {
                            disconnect: true,
                        },
                    },
                });
                return acceptBid;
            }));
            return bid;
        });
    }
    // Reject A Bid
    rejectABid(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const bid = yield prisma.bid.update({
                where: {
                    id: args.bidId,
                },
                data: {
                    accepted: false,
                    rejectedByUser: {
                        connect: {
                            id: args.userId,
                        },
                    },
                    acceptedByUser: {
                        disconnect: true,
                    },
                },
            });
            return bid;
        });
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = __decorate([
    (0, inversify_1.injectable)()
], PropertyService);

import { injectable } from "inversify";
import { IPropertyService } from "../interfaces/IPropertyService";
import { Bid, PrismaClient, Property, User, UserType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

@injectable()
export class PropertyService implements IPropertyService {
  public async createProperty(args: {
    landlordId: number;
    price: number;
    address: string;
    amenities: string[];
    numberOfRooms: number;
    mediaUrls: string[];
  }): Promise<Property> {
    const property = await prisma.$transaction(async (tx) => {
      // Confirm Landlord With Id Exists
      const landlord = await tx.landLord.findUniqueOrThrow({
        where: {
          id: args.landlordId,
        },
      });

      // Create Property
      const property = await tx.property.create({
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
    });

    return property;
  }

  public async getPropertyListings(): Promise<Array<Property>> {
    const properties = await prisma.property.findMany({
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
  }

  // BIDDING WAR
  // Create Bidding For A Property
  public async createBidding(args: {
    propertyId: number;
    tenantId: number;
    amount: number;
  }): Promise<Bid> {
    const bid = await prisma.$transaction(async (tx) => {
      // Confirm Tenant Actually Exists
      const tenant = await tx.tenant.findUniqueOrThrow({
        where: {
          id: args.tenantId,
        },
      });

      // Confirm Property With Id Actually Exists
      const property = await tx.property.findUniqueOrThrow({
        where: {
          id: args.propertyId,
        },
      });

      if (property.sold) {
        throw new Error("Property has already been sold");
      }

      // Create a new bid
      const bid = await tx.bid.create({
        data: {
          tenantId: tenant.id,
          propertyId: property.id,
          bidAmount: args.amount,
        },
      });

      return bid;
    });

    return bid;
  }

  // Create Counter Bid
  public async createCounterBidding(args: {
    bidId: number;
    landlordId: number;
    counterAmount: number;
  }): Promise<Bid> {
    const counterBid = await prisma.$transaction(async (tx) => {
      // Confirm Landlord Actually Exists
      const landlord = await tx.landLord.findUniqueOrThrow({
        where: {
          id: args.landlordId,
        },
      });

      // Counter Bid
      // Confirm there is a bid to actually be countered
      const bid = await tx.bid.findUniqueOrThrow({
        where: {
          id: args.bidId,
        },
      });
      if (!bid.bidAmount && !bid.tenantId) {
        throw new Error(
          "A tenant has to make a bid first, before it can be countered"
        );
      }

      // make a counter bid
      const counterBid = await tx.bid.update({
        where: {
          id: bid.id,
        },

        data: {
          landLordId: landlord.id,
          counterBidAmount: args.counterAmount,
        },
      });

      return counterBid;
    });

    return counterBid;
  }

  // Get All Bids On A Property
  public async getPropertyBiddings(args: {
    propertyId: number;
  }): Promise<Array<Bid>> {
    const biddings = await prisma.bid.findMany({
      where: {
        propertyId: args.propertyId,
      },
    });

    return biddings;
  }

  // Accept A Bid
  // Once a Bid is Accepted Make Sure That The Landlord Cant Accept ANother Bid For The Same Property
  public async acceptABid(args: {
    bidId: number;
    propertyId: number;
    userId: number;
  }): Promise<Bid> {
    const bid = await prisma.$transaction(async (tx) => {
      const propertyBiddings = await tx.bid.findMany({
        where: {
          propertyId: args.propertyId,
        },
      });
      if (propertyBiddings.some((bid) => bid.accepted === true)) {
        throw new Error(
          "A bid on this property has already been accepted, you cant accept another one"
        );
      }

      // Accept A Bid
      const acceptBid = await tx.bid.update({
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
    });

    return bid;
  }

  // Reject A Bid
  public async rejectABid(args: {
    bidId: number;
    userId: number;
  }): Promise<Bid> {
    const bid = await prisma.bid.update({
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
  }
}

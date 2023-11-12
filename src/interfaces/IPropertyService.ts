import { Bid, Property, User } from "@prisma/client";

export interface IPropertyService {
  createProperty(args: {
    landlordId: number;
    price: number;
    address: string;
    amenities: string[];
    numberOfRooms: number;
    mediaUrls: string[];
  }): Promise<Property>;

  getPropertyListings(): Promise<Array<Property>>;

  // BIDDING WAR
  // Create Bidding For A Property
  createBidding(args: {
    propertyId: number;
    tenantId: number;
    amount: number;
  }): Promise<Bid>;

  // Create Counter Bid
  createCounterBidding(args: {
    bidId: number;
    landlordId: number;
    counterAmount: number;
  }): Promise<Bid>;

  // Get All Bids On A Property
  getPropertyBiddings(args: { propertyId: number }): Promise<Array<Bid>>;

  // Accept A Bid
  // Once a Bid is Accepted Make Sure That The Landlord Cant Accept ANother Bid For The Same Property
  acceptABid(args: {
    bidId: number;
    propertyId: number;
    userId: number;
  }): Promise<Bid>;

  // Reject A Bid
  rejectABid(args: { bidId: number; userId: number }): Promise<Bid>;
}

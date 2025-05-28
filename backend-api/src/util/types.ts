import { Request } from "express"
import { UserType } from "../Models/User"

export interface FilterProperties{
    title?:string,
    typeProperty:string // villa , Studio , penthouse
    priceMin?:[number,number], // 0
    state?:string, // dehli maharatra 
    city?:string, // thane
    areaSqFt?:[number,number], // 2323
    bedrooms?:number, // 1 l 2
    bathrooms?:number, // 1 l 2
    furnished?:string,
    amenities?:string[],
    availableFrom?:string[],
    listedBy?:string,
    rating?:number, // 1,2,3,4,5
    type?:string, // buy | sell
    isVerified?:boolean, 
    listingType?:string
}

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}
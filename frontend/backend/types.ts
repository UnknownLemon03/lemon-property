import { UUID } from "crypto";

export interface IProperty {
  title: string;
  type: string;
  price: number;
  state: string;
  city: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  furnished: string;
  availableFrom: string; // ISO date string
  listedBy: string;
  tags: string[];
  colorTheme: string;
  rating: number;
  isVerified: boolean;
  listingType: string;
  _id: UUID;
  favorite?: boolean; // Optional, true if the property is favorited by the user
}

export interface FilterProperties {
  title?: string;
  typeProperty?: string; // villa , Studio , penthouse
  priceMin?: [number, number]; // 0
  state?: string; // dehli maharatra
  city?: string; // thane
  areaSqFt?: [number, number]; // 2323
  bedrooms?: number; // 1 l 2
  bathrooms?: number; // 1 l 2
  furnished?: string;
  amenities?: string[];
  availableFrom?: string[];
  listedBy?: string;
  rating?: number; // 1,2,3,4,5
  type?: string; // buy | sell
  isVerified?: boolean;
  listingType?: string;
  userProperty?: boolean; // true if user property
  page?: number; // 1,
  recommendation?: boolean; // true if recommendation
  favorite?: boolean; // true if favorite
}

export interface FilterOptions {
  propertyTypes: string[];
  states: string[];
  cities: string[];
  furnishingOptions: string[];
  listedByOptions: string[];
  listingTypes: string[];
  amenitiesOptions: string[];
}

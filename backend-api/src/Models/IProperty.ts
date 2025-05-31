import { z } from "zod";
import { Types } from "mongoose";
import mongoose, { Schema, Document, Mongoose } from "mongoose";
import { infer } from "zod";
import { UUIDTypes, v4 as uuidv4 } from "uuid";
import { UserType } from "./User";
export interface IProperty extends Document {
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
  availableFrom: Date;
  listedBy: string;
  tags: string[];
  colorTheme: string;
  rating: number;
  isVerified: boolean;
  listingType: string;
  listedByUser: mongoose.Types.ObjectId; // Reference to User model,
  _id: UUIDTypes;
}

// Custom UUID type if you are using a UUID validation pattern
const uuidSchema = z.string().uuid();

export const propertySchema = z.object({
  title: z.string(),
  type: z.string(),
  price: z.number(),
  state: z.string(),
  city: z.string(),
  areaSqFt: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  amenities: z.array(z.string()),
  furnished: z.string(),
  availableFrom: z.coerce.date(),
  listedBy: z.string(),
  tags: z.array(z.string()),
  colorTheme: z.string(),
  rating: z.number(),
  isVerified: z.boolean(),
  listingType: z.string(),
  listedByUser: z.instanceof(Types.ObjectId),
  _id: uuidSchema,
});

export type PropertyType = z.infer<typeof propertySchema>;

const PropertySchema: Schema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    areaSqFt: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    amenities: { type: [String], default: [] },
    furnished: { type: String, required: true },
    availableFrom: { type: Date, required: true },
    listedBy: { type: String, required: true },
    tags: { type: [String], default: [] },
    colorTheme: { type: String },
    rating: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    listingType: { type: String, required: true },
    listedByUser: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference here
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model<IProperty>("Property", PropertySchema);

export default Property;

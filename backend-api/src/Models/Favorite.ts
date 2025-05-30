import mongoose, { Schema, Document } from "mongoose";

export interface FavoriteType extends Document {
  _id: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema: Schema<FavoriteType> = new Schema(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Property",
      unique: true,
    },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  {
    timestamps: true,
  }
);
FavoriteSchema.index({ propertyId: 1, user: 1 }, { unique: true });

const Favorite = mongoose.model<FavoriteType>("Favorite", FavoriteSchema);

export default Favorite;

import mongoose, { Schema, Document } from "mongoose";

export interface Recommendation extends Document {
  _id: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RecommendationSchema: Schema<Recommendation> = new Schema(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Property",
      unique: true,
    },
    receiverId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  {
    timestamps: true,
  }
);
RecommendationSchema.index({ propertyId: 1, receiverId: 1 }, { unique: true });
const Recommendation = mongoose.model<Recommendation>(
  "Recommendation",
  RecommendationSchema
);

export default Recommendation;

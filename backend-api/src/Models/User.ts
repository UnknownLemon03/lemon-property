import mongoose, { Schema, Document, Mongoose } from "mongoose";
export interface UserType extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema<UserType>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserType>("User", UserSchema);

export default User;

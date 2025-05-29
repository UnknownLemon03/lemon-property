import { NextFunction, Request, Response } from "express";
import { GetUser } from "./UserAuth";
import User, { UserType } from "../Models/User";
import Property from "../Models/IProperty";
import { populate } from "dotenv";

export async function isLoginMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = await GetUser(req);
  if (!user) {
    return next(new Error("User not Logged in"));
  }
  req.user = user;
  return next();
}
export async function insertUserMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = await GetUser(req);
  if (user) {
    req.user = user;
  }
  return next();
}

export async function isPropertyCreator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  if (!user) {
    return next(new Error("User not Logged in"));
  }
  const { id } = req.body;
  const property = await Property.findOne({
    _id: id,
  }).populate("listedByUser");
  if (property == null) return next(new Error("Property not vaild"));
  if (property.listedByUser._id == user._id) {
    // Authorized: the logged-in user is the one who listed this property
    return next();
  }
  return next(new Error("Not Autorised"));
}

import { Request } from "express";
import User from "../Models/User";
import { FilterProperties } from "./types";
import Property, { IProperty } from "../Models/IProperty";
import crypto from "crypto";
import { GetUser } from "./UserAuth";
import mongoose, { Mongoose } from "mongoose";
import Favorite from "../Models/Favorite";
import Recommendation from "../Models/Recommendation";

export async function FilterProperties(req: Request) {
  const filters = req.body as FilterProperties;
  console.clear();
  console.log("Filters received:", filters);
  if (!filters) {
    return await Property.find({});
  }
  const page = req.body.page;
  const limit = 20;
  const skip = (page - 1) * limit;

  const mongoQuery: any = {};

  if (filters.title) {
    mongoQuery.title = { $regex: filters.title, $options: "i" };
  }
  if (filters.userProperty) {
    const user = await GetUser(req);
    console.log(user);
    if (user) {
      mongoQuery.listedByUser = user._id.toString();
      console.log("User property filter applied:", mongoQuery.listedByUser);
    }
  }

  if (filters.typeProperty) {
    mongoQuery.type = filters.typeProperty;
  }

  if (filters.priceMin && filters.priceMin.length === 2) {
    mongoQuery.price = { $gte: filters.priceMin[0], $lte: filters.priceMin[1] };
  }

  if (filters.state) {
    mongoQuery.state = filters.state;
  }

  if (filters.city) {
    mongoQuery.city = filters.city;
  }

  if (filters.areaSqFt && filters.areaSqFt.length === 2) {
    mongoQuery.areaSqFt = {
      $gte: filters.areaSqFt[0],
      $lte: filters.areaSqFt[1],
    };
  }

  if (filters.bedrooms !== undefined) {
    mongoQuery.bedrooms = filters.bedrooms;
  }

  if (filters.bathrooms !== undefined) {
    mongoQuery.bathrooms = filters.bathrooms;
  }

  if (filters.furnished !== undefined) {
    if (typeof filters.furnished === "string") {
      mongoQuery.furnished = filters.furnished.toLowerCase() === "true";
    } else if (typeof filters.furnished === "boolean") {
      mongoQuery.furnished = filters.furnished;
    }
  }

  if (filters.amenities && filters.amenities.length > 0) {
    mongoQuery.amenities = { $all: filters.amenities };
  }

  if (filters.availableFrom && filters.availableFrom.length > 0) {
    const dates = filters.availableFrom.map((d) => new Date(d));
    const earliestDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    mongoQuery.availableFrom = { $gte: earliestDate };
  }

  if (filters.listedBy) {
    mongoQuery.listedBy = filters.listedBy;
  }

  if (filters.rating !== undefined) {
    mongoQuery.rating = { $gte: filters.rating };
  }

  if (filters.type) {
    mongoQuery.listingType = filters.type;
  }

  if (filters.isVerified !== undefined) {
    mongoQuery.isVerified = filters.isVerified;
  }

  if (filters.listingType) {
    mongoQuery.listingType = filters.listingType;
  }

  let favorateHash: { [key: string]: string } = {};
  if (req.user) {
    const favorate = Favorite.find({
      user: req.user._id,
    });
    (await favorate).forEach((e) => {
      favorateHash[e.propertyId.toString()] = e._id.toString();
    });
    console.log("MongoDB Query:", favorateHash);
  }
  if (filters.favorite) {
    mongoQuery._id = {
      $in: Object.keys(favorateHash).map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
    };
  }
  if (filters.recommendation) {
    const user = await GetUser(req);
    if (user) {
      const recommendations = await Recommendation.aggregate([
        { $match: { receiverId: user._id } },
        {
          $lookup: {
            from: "properties", // MongoDB collection name is lowercase plural by default
            localField: "propertyId",
            foreignField: "_id",
            as: "property",
          },
        },
        { $unwind: "$property" },
      ]);

      mongoQuery._id = { $in: recommendations.map((r) => r.property._id) };
    }
  }
  const data = await Property.find(mongoQuery).skip(skip).limit(limit);
  const res: any = [];
  data.forEach((property) => {
    const propertyData = {
      ...property.toObject(),
      favorite: favorateHash[property._id.toString()] || false,
    };
    res.push(propertyData);
  });

  return res;
}

function hash_property(property: FilterProperties) {
  const normalized = {
    listingType: property.listingType,
    areaSqFt: property.areaSqFt,
    rating: property.rating,
    isVerified: property.isVerified,
    amenities: [...(property.amenities || [])].sort(),
  };

  const jsonString = JSON.stringify(normalized, Object.keys(normalized).sort());
  return crypto.createHash("sha256").update(jsonString).digest("hex");
}

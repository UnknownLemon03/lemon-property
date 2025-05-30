import { Request, Router } from "express";
import { isLoginMiddleWare, isPropertyCreator } from "../util/Middleware";
import { FilterProperties } from "../util/Services";
import Property, { IProperty } from "../Models/IProperty";
import Recommendation from "../Models/Recommendation";
import User from "../Models/User";
import { getCatch, setCatch } from "../redis/redits";

const RecommendationRoute = Router();

RecommendationRoute.get("/", isLoginMiddleWare, async (req, res) => {
  const catchedData = await getCatch("recommendations_" + req.user!._id);
  if (catchedData) {
    res.json({
      success: true,
      error: "",
      data: JSON.parse(catchedData),
    });
    return;
  }
  const dataDB = await Recommendation.find({
    receiverId: req.user!._id,
  }).populate("propertyId");

  let data = dataDB.map((e) => e.propertyId);
  console.log(data);
  setCatch("recommendations_" + req.user!._id, JSON.stringify(data));
  res.json({
    success: true,
    error: "",
    data,
  });
});

RecommendationRoute.post("/", isLoginMiddleWare, async (req, res) => {
  const { email, property_id } = req.body;
  const [property, receiver] = await Promise.all([
    Property.findById(property_id),
    User.findOne({
      email: {
        $regex: email.trim(),
        $options: "i",
      },
    }),
  ]);

  if (!property || !receiver) {
    console.log(receiver, property);
    const error = `${property ? "Email" : "Property"} not found`;
    res.status(404).json({
      success: false,
      error,
      data: null,
    });
    return;
  }
  if (req.user!._id.toString() === receiver._id.toString()) {
    res.status(400).json({
      success: false,
      error: "You cannot recommend your own property",
      data: null,
    });
    return;
  }
  await Recommendation.findOneAndUpdate(
    { propertyId: property._id, receiverId: receiver._id },
    { propertyId: property._id, receiverId: receiver._id },
    { upsert: true, new: true }
  );
  res.json({
    success: true,
    error: "",
    data: null,
  });
});

export default RecommendationRoute;

import { Request, Router } from "express";
import {
  insertUserMiddleWare,
  isLoginMiddleWare,
  isPropertyCreator,
} from "../util/Middleware";
import { FilterProperties, getFilterOptions } from "../util/Services";
import Property, { IProperty } from "../Models/IProperty";
import { getCatch, hash_property, setCatch } from "../redis/redits";

const PropertyRouter = Router();

PropertyRouter.post("/filter", insertUserMiddleWare, async (req, res) => {
  const hash = hash_property(req.body);
  const cachedData = await getCatch(hash);
  if (cachedData) {
    res.json({
      data: JSON.parse(cachedData),
      error: "",
      success: true,
    });
    return;
  }
  // If not cached, filter properties
  const data = await FilterProperties(req);
  await setCatch(hash, JSON.stringify(data));
  res.json({
    data,
  });
});

PropertyRouter.get("/filters", async (req, res) => {
  // Check if the filter options are cachedg
  const cachedFilters = await getCatch("filterOptions");
  if (cachedFilters) {
    res.json({
      data: JSON.parse(cachedFilters),
      error: "",
      success: true,
    });
    return;
  }
  // If not cached, fetch the filter options
  const data = await getFilterOptions();
  await setCatch("filterOptions", JSON.stringify(data));
  res.json({
    data,
    error: "",
    success: true,
  });
});

PropertyRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const cachedData = await getCatch(`property_${id}`);
  if (cachedData) {
    res.json({
      data: JSON.parse(cachedData),
      error: "",
      success: true,
    });
    return;
  }
  // If not cached, fetch the property by ID

  const data = await Property.findById(id);
  await setCatch(`property_${id}`, JSON.stringify(data));
  res.json({
    data,
    error: "",
    success: true,
  });
});

PropertyRouter.get("/", async (req, res) => {
  const cachedData = await getCatch("allProperties");
  if (cachedData) {
    res.json({
      data: JSON.parse(cachedData),
      error: "",
      success: true,
    });
    return;
  }
  // If not cached, fetch all properties

  const data = await Property.find({}).limit(20);
  setCatch("allProperties", JSON.stringify(data));
  res.json({
    data,
    error: "",
    success: true,
  });
});

PropertyRouter.post("/", isLoginMiddleWare, async (req, res) => {
  const data = req.body as IProperty;
  const user = req.user!;
  data.listedByUser = user._id;
  const newPropertie = await Property.create(data);
  await newPropertie.save();
  res.json({
    toast: "Propertie Added Successfully",
    error: "",
    success: true,
  });
});

PropertyRouter.put("/", async (req: Request, res) => {
  const data = req.body as IProperty;
  const user = req.user!;
  console.log(data);
  await Property.findByIdAndUpdate(data._id, data);
  res.json({
    toast: "Propertie Updated Successfully",
    error: "",
    success: true,
  });
});

PropertyRouter.delete("/", async (req, res) => {
  try {
    const data = await Property.deleteOne({ _id: req.body.id });
    console.log(data);
    res.json({
      toast: "Property Deleted Successfully",
      error: "",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      toast: "",
      error: "Failed to delete property",
      success: true,
    });
  }
});

export default PropertyRouter;

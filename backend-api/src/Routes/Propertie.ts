import { Request, Router } from "express";
import {
  insertUserMiddleWare,
  isLoginMiddleWare,
  isPropertyCreator,
} from "../util/Middleware";
import { FilterProperties, getFilterOptions } from "../util/Services";
import Property, { IProperty, propertySchema } from "../Models/IProperty";
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
  if (!propertySchema.parse(data)) {
    res.status(400).json({
      toast: "",
      error: "Invalid property data",
      success: false,
    });
    return;
  } // Validate the data against the schema
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

/**
 * @openapi
 * /property/filter:
 *   post:
 *     summary: Filter properties based on criteria
 *     description: Apply filters to search properties
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Filter criteria object (depends on your implementation)
 *     responses:
 *       200:
 *         description: Filtered properties list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *                 error:
 *                   type: string
 *                   example: ""
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 * /property/filters:
 *   get:
 *     summary: Get available filter options for properties
 *     description: Fetch options such as locations, price ranges, types, etc.
 *     responses:
 *       200:
 *         description: Filter options
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Filter options object
 *                 error:
 *                   type: string
 *                   example: ""
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 * /property/{id}:
 *   get:
 *     summary: Get a property by ID
 *     description: Fetch detailed information of a single property
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Property ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *                 error:
 *                   type: string
 *                   example: ""
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 * /property:
 *   get:
 *     summary: Get a list of properties
 *     description: Fetches a list of properties limited to 20
 *     responses:
 *       200:
 *         description: List of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *                 error:
 *                   type: string
 *                   example: ""
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *   post:
 *     summary: Add a new property
 *     description: Create a new property listing. Requires authentication.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyInput'
 *     responses:
 *       200:
 *         description: Property added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 toast:
 *                   type: string
 *                   example: Propertie Added Successfully
 *                 error:
 *                   type: string
 *                   example: ""
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *   put:
 *     summary: Update an existing property
 *     description: Update details of a property
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyInput'
 *     responses:
 *       200:
 *         description: Property updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 toast:
 *                   type: string
 *                   example: Propertie Updated Successfully
 *                 error:
 *                   type: string
 *                   example: ""
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *   delete:
 *     summary: Delete a property
 *     description: Delete a property by its ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: Property ID to delete
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 toast:
 *                   type: string
 *                   example: Property Deleted Successfully
 *                 error:
 *                   type: string
 *                   example: ""
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Failed to delete property
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 toast:
 *                   type: string
 *                   example: ""
 *                 error:
 *                   type: string
 *                   example: Failed to delete property
 *                 success:
 *                   type: boolean
 *                   example: false
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         title:
 *           type: string
 *           example: Beautiful Apartment Downtown
 *         description:
 *           type: string
 *           example: Spacious 3 bedroom apartment with modern amenities.
 *         price:
 *           type: number
 *           example: 250000
 *         location:
 *           type: string
 *           example: New York
 *         typeProperty:
 *           type: string
 *           enum: [villa, studio, penthouse]
 *           example: villa
 *         state:
 *           type: string
 *           example: Maharashtra
 *         city:
 *           type: string
 *           example: Thane
 *         areaSqFt:
 *           type: number
 *           example: 2323
 *         bedrooms:
 *           type: integer
 *           example: 3
 *         bathrooms:
 *           type: integer
 *           example: 2
 *         furnished:
 *           type: string
 *           enum: [furnished, unfurnished, semi-furnished]
 *           example: furnished
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           example: ["gym", "swimming pool"]
 *         availableFrom:
 *           type: array
 *           items:
 *             type: string
 *             format: date
 *           example: ["2025-06-01"]
 *         listedBy:
 *           type: string
 *           example: AgentX
 *         rating:
 *           type: number
 *           example: 4
 *         type:
 *           type: string
 *           enum: [buy, sell]
 *           example: buy
 *         isVerified:
 *           type: boolean
 *           example: true
 *         listingType:
 *           type: string
 *           example: premium
 *         userProperty:
 *           type: boolean
 *           example: true
 *         favorite:
 *           type: boolean
 *           example: false
 *         recommendation:
 *           type: boolean
 *           example: true
 *         listedByUser:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-05-10T12:00:00Z
 *
 *     PropertyInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - location
 *         - typeProperty
 *       properties:
 *         title:
 *           type: string
 *           example: Beautiful Apartment Downtown
 *         description:
 *           type: string
 *           example: Spacious 3 bedroom apartment with modern amenities.
 *         price:
 *           type: number
 *           example: 250000
 *         location:
 *           type: string
 *           example: Thane, Maharashtra
 *         typeProperty:
 *           type: string
 *           enum: [villa, studio, penthouse]
 *           example: villa
 *         state:
 *           type: string
 *           example: Maharashtra
 *         city:
 *           type: string
 *           example: Thane
 *         areaSqFt:
 *           type: number
 *           example: 2323
 *         bedrooms:
 *           type: integer
 *           example: 3
 *         bathrooms:
 *           type: integer
 *           example: 2
 *         furnished:
 *           type: string
 *           enum: [furnished, unfurnished, semi-furnished]
 *           example: furnished
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           example: ["gym", "swimming pool"]
 *         availableFrom:
 *           type: array
 *           items:
 *             type: string
 *             format: date
 *           example: ["2025-06-01"]
 *         listedBy:
 *           type: string
 *           example: AgentX
 *         rating:
 *           type: number
 *           example: 4
 *         type:
 *           type: string
 *           enum: [buy, sell]
 *           example: buy
 *         isVerified:
 *           type: boolean
 *           example: true
 *         listingType:
 *           type: string
 *           example: premium
 *         userProperty:
 *           type: boolean
 *           example: true
 *         favorite:
 *           type: boolean
 *           example: false
 *         recommendation:
 *           type: boolean
 *           example: true
 */

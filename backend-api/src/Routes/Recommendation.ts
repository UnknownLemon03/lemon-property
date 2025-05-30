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
/**
 * @openapi
 * /recommendation:
 *   get:
 *     summary: Get user recommendations
 *     description: Fetch all property recommendations for the authenticated user. Results are cached in Redis.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of recommended properties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 error:
 *                   type: string
 *                   example: ""
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Authentication required"
 *                 data:
 *                   type: null
 *
 *   post:
 *     summary: Create a property recommendation
 *     description: Recommend a property to another user by their email address. Cannot recommend to yourself.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - property_id
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the user to receive the recommendation
 *                 example: "user@example.com"
 *               property_id:
 *                 type: string
 *                 description: ID of the property to recommend
 *                 example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Recommendation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 error:
 *                   type: string
 *                   example: ""
 *                 data:
 *                   type: null
 *       400:
 *         description: Bad request - Cannot recommend to yourself
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "You cannot recommend your own property"
 *                 data:
 *                   type: null
 *       401:
 *         description: Unauthorized - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Authentication required"
 *                 data:
 *                   type: null
 *       404:
 *         description: Property or email not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Email not found"
 *                 data:
 *                   type: null
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Recommendation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c86"
 *         propertyId:
 *           type: string
 *           description: Reference to the recommended property
 *           example: "60d21b4667d0d8992e610c85"
 *         receiverId:
 *           type: string
 *           description: Reference to the user receiving the recommendation
 *           example: "60d0fe4f5311236168a109ca"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-05-10T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-05-10T12:00:00Z"
 *
 *     RecommendationInput:
 *       type: object
 *       required:
 *         - email
 *         - property_id
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email of the user to receive the recommendation
 *           example: "user@example.com"
 *         property_id:
 *           type: string
 *           description: ID of the property to recommend
 *           example: "60d21b4667d0d8992e610c85"
 *
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: connect.sid
 *       description: Session cookie for authentication
 */

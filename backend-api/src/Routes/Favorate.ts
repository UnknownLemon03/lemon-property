import { Router } from "express";
import Favorite from "../Models/Favorite";
import { isLogin } from "../util/UserAuth";
import { isLoginMiddleWare } from "../util/Middleware";

const FavoriteRoute = Router();

FavoriteRoute.post("/", isLoginMiddleWare, async (req, res) => {
  const id = req.body.id;
  console.log("Favorite Route", id);
  if (!id) {
    res.status(400).json({
      success: false,
      error: "Property ID is required",
      data: null,
    });
    return;
  }
  const userId = req.user!._id;
  const data = await Favorite.findOneAndUpdate(
    { propertyId: id, user: userId }, // Find condition
    { propertyId: id, user: userId }, // Fields to update
    {
      new: true, // Return the updated document
      upsert: true, // Insert if not found
      setDefaultsOnInsert: true, // Apply schema defaults if inserting
    }
  );
  await data.save();

  res.json({
    success: true,
    error: "",
    data: null,
  });
});

FavoriteRoute.delete("/", isLoginMiddleWare, async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).json({
      success: false,
      error: "Property ID is required",
      data: null,
    });
    return;
  }
  const userId = req.user!._id;
  await Favorite.deleteOne({
    propertyId: id,
    user: userId,
  });

  res.json({
    success: true,
    error: "",
    data: null,
  });
});
export default FavoriteRoute;

/**
 * @openapi
 * /favorite:
 *   post:
 *     summary: Add or update a favorite property
 *     description: Add a property to user's favorites or update if already exists
 *     security:
 *       - cookieAuth: []
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
 *                 description: Property ID to favorite
 *     responses:
 *       200:
 *         description: Success response
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
 *                   nullable: true
 *                   type: string
 *                   example: null
 *       400:
 *         description: Missing property ID
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
 *                   example: Property ID is required
 *                 data:
 *                   nullable: true
 *                   type: string
 *                   example: null
 *
 *   delete:
 *     summary: Remove a favorite property
 *     description: Remove a property from user's favorites
 *     security:
 *       - cookieAuth: []
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
 *                 description: Property ID to remove from favorites
 *     responses:
 *       200:
 *         description: Success response
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
 *                   nullable: true
 *                   type: string
 *                   example: null
 *       400:
 *         description: Missing property ID
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
 *                   example: Property ID is required
 *                 data:
 *                   nullable: true
 *                   type: string
 *                   example: null
 */

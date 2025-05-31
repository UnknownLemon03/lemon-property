import { Router } from "express";
import { CreateJWTSession, CreateUser } from "../util/UserAuth";
import jwt from "jsonwebtoken";
import User from "../Models/User";
import bcrypt from "bcrypt";
import { error } from "console";
import { getCatch, setCatch } from "../redis/redits";

const AuthRouter = Router();

AuthRouter.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!req.body || !email || !password) {
      const err = new Error(
        !email ? "Email is required" : "Password is required"
      );
      err.name = "ValidationError";
      return next(err);
    }
    // sign up the user
    const user = await CreateUser({ email, password });
    if (user == null) {
      res.status(500).json({
        data: "",
        error: "Error creating User",
        success: false,
      });
      return;
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRETE!);
    res.cookie("AUTH", token, {
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1000,
    });
    res.status(200).json({
      data: "Sucessfull sign up",
      error: "",
      success: true,
    });
  } catch (e) {
    let error = "Error Creating Account";
    if (e instanceof Error) error = e.message;
    next(new Error(error));
  }
});
AuthRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!req.body || !email || !password) {
    return next(
      new Error(!email ? "Email is required" : "Password is required")
    );
  }
  // sign up the user
  const user = await User.findOne({
    email: { $regex: email, $options: "i" },
  });
  if (user == null || !bcrypt.compareSync(password, user.password)) {
    return next(new Error("Invalid credetials"));
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRETE!);

  res.cookie("AUTH", token, {
    sameSite: "lax",
    maxAge: 12 * 60 * 60 * 1000,
  });
  res.status(200).json({
    data: "Sucessfull Login in",
    error: "",
    success: true,
  });
});

AuthRouter.post("/", async (req, res) => {
  const email = req.body.email;
  const catchData = await getCatch(`email_${email}`);
  if (catchData) {
    res.json({
      data: JSON.parse(catchData),
      error: "",
      success: true,
    });
    return;
  }
  // If not cached, validate the email
  if (email == null || email.length < 3) {
    res.status(400).json({
      data: null,
      error: "Email is required, minimum 3 characters",
      success: false,
    });
    return;
  }
  // find the user with email
  const data = await User.find({
    email: { $regex: email, $options: "i" },
  })
    .limit(5)
    .select("email");
  await setCatch(`email_${email}`, JSON.stringify(data));
  res.json({
    data: data.map((e) => e.email),
    error: "",
    success: true,
  });
});

export default AuthRouter;
/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Sign up the user
 *     description: Use to register a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: User's password
 *                 example: mySecurePassword123
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: "Successful sign up"
 *                 error:
 *                   type: string
 *                   example: ""
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: "null"
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Email is required or password too short"
 *                 success:
 *                   type: boolean
 *                   example: false
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: "null"
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "User with this email already exists"
 *                 success:
 *                   type: boolean
 *                   example: false
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in the user
 *     description: Authenticate an existing user and create a session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: mySecurePassword123
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: "Successful login"
 *                 error:
 *                   type: string
 *                   example: ""
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: "null"
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Email and password are required"
 *                 success:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: "null"
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Invalid email or password"
 *                 success:
 *                   type: boolean
 *                   example: false
 */

/**
 * @openapi
 * /auth/:
 *   post:
 *     summary: Search for user emails
 *     description: Search and retrieve user email addresses based on search criteria
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
 *             properties:
 *               email:
 *                 type: string
 *                 minLength: 3
 *                 description: Email search query (partial or full email)
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Successfully retrieved matching email addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: email
 *                   example: ["admin@admin.com", "admin@company.com"]
 *                 error:
 *                   type: string
 *                   example: ""
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid email search input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: "null"
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Email is required, minimum 3 characters"
 *                 success:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: No matching emails found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: []
 *                 error:
 *                   type: string
 *                   example: "No matching emails found"
 *                 success:
 *                   type: boolean
 *                   example: false
 */

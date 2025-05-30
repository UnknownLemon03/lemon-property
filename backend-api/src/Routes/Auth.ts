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

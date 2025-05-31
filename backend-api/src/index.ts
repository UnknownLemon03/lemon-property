console.clear();
import express, { json, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import AuthRouter from "./Routes/Auth";
import cookieParser from "cookie-parser";
import { CreateUser, GetUser, isLogin } from "./util/UserAuth";
import dotenv from "dotenv";
import PropertyRouter from "./Routes/Propertie";
import cors from "cors";
import User from "./Models/User";
import dataDB from "./util/ignore";
import Property from "./Models/IProperty";
import RecommendationRoute from "./Routes/Recommendation";
import FavoriteRoute from "./Routes/Favorate";
import { ConnectRedis } from "./redis/redits";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./util/swagger";

dotenv.config();
const app = express();

app.use(json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    preflightContinue: false,
  })
);
app.use((req, res, next) => {
  console.log(req.originalUrl, process.env.CLIENT_URL);
  next();
});
async function mainDBConnect() {
  try {
    await mongoose.connect(
      process.env.DB_URL || "mongodb://localhost:27017/real-estate"
    );
    console.log("Database connected");
  } catch (error) {
    console.error("Database is not connected\n", error);
    process.exit(1);
  }
}

app.use("/auth", AuthRouter);
app.use("/property", PropertyRouter);
app.use("/recommend", RecommendationRoute);
app.use("/favorate", FavoriteRoute);
//lemon-property-frontend.vercel.app/
https: app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.all("/", (req, res) => {
  res.send("No Route Found");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error occurred:", err);
  res.status(500).json({
    data: null,
    error: err.message ?? "Something went wrong",
    success: false,
  });
});

app.listen(process.env.SERVER_PORT, async () => {
  console.log("server is on 5000");
  await mainDBConnect();
  await ConnectRedis();
  // console.log('admin created')

  // // adding new properties
  // const admin = await CreateUser({
  //   email: "admin@admin",
  //   password: "admin@admin",
  // });
  // const data = dataDB.map((e) => {
  //   let temp = {
  //     ...e,
  //     id: undefined,
  //     listedByUser: admin,
  //     amenities: e.amenities.split("|"),
  //     tags: e.tags.split("|"),
  //   };
  //   delete temp.id;
  //   return temp;
  // });
  // await Property.insertMany(data);
  // console.log("updated the database");
});

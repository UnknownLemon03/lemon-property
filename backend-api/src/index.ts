console.clear();
import express, { json, NextFunction, Request, Response } from "express"
import mongoose from "mongoose";
import AuthRouter from "./Routes/Auth";
import cookieParser from "cookie-parser";
import { CreateUser, GetUser, isLogin } from "./util/UserAuth";
import dotenv from "dotenv"
import PropertyRouter from "./Routes/Propertie";
import Property, { IProperty } from "./Models/IProperty";
import dataDB from "./util/ignore";
import User from "./Models/User";
dotenv.config()
const app = express();

app.use(json())
app.use(cookieParser());


async function mainDBConnect() {
  try {
    await mongoose.connect('mongodb://localhost:27017');
    console.log("Database connected");
  } catch (error) {
    console.error("Database is not connected\n", error);
    process.exit(1); 
  }
}

app.use("/auth",AuthRouter)
app.use("/property",PropertyRouter)

app.all("/",(req,res)=>{
    res.send("No Route Found")
})


app.use((err:Error, req:Request, res:Response, next:NextFunction) => {
  res.status(400).json({
    data: null,
    error: err.message || "Something went wrong"
  });
});


app.listen(3000,async ()=>{
    console.log("server is on 3000 ")
    await mainDBConnect();
    await CreateUser({email:"admin",password:'admin'});
    const admin = await User.findOne({
      email:"admin"
    })
    // console.log('admin created')


    // adding new properties
    // const data = dataDB.map(e=>{
    //     let temp = {...e,id:undefined,listedByUser:admin,amenities:e.amenities.split("|"),tags:e.tags.split("|")} 
    //     delete temp.id
    //     return temp
    // }) 
    // await Property.insertMany(data)
    // console.log("updated the database")
})
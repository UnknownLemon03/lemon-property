import { Router } from "express";
import { CreateJWTSession, CreateUser } from "../util/UserAuth";
import jwt from "jsonwebtoken";
import User from "../Models/User";
import bcrypt from "bcrypt";

const AuthRouter = Router()

AuthRouter.post("/signup",async (req,res,next)=>{
    console.log(req.body)
    const {email,password} = req.body;

    if (!req.body || !email || !password) {
        const err = new Error(!email ? "Email is required" : "Password is required");
        err.name = "ValidationError";
        return next(err);
    }
    // sign up the user 
    const user = await CreateUser({email,password});
    if(user==null){
            res.status(500).json({
            data:"",
            error:"Error creating User"
        })
        return;
    }
    const token = jwt.sign({id:user.id },process.env.JWT_SECRETE!)
    res.cookie("AUTH", token, {
        sameSite: "lax",
        maxAge: 12 * 60 * 60 * 1000 
    });
    res.status(200).json({
        data:"Sucessfull sign up",
        error:""
    })
})
AuthRouter.post("/login",async (req,res,next)=>{
    console.log(req.body)
    const {email,password} = req.body;

    if (!req.body || !email || !password) {
        const err = new Error(!email ? "Email is required" : "Password is required");
        err.name = "ValidationError";
        return next(err);
    }
    // sign up the user 
    const user = await User.findOne({
        email: { $regex: email, $options: 'i' } 
    });
    if(user==null || !bcrypt.compareSync(password,user.password)){
        res.status(500).json({
            data:"",
            error:"Invalid credians!"
        })
        return;
    }

   
    const token = jwt.sign({id:user.id },process.env.JWT_SECRETE!)

    res.cookie("AUTH", token, {
        sameSite: "lax",
        maxAge: 12 * 60 * 60 * 1000 
    });
    res.status(200).json({
        data:"Sucessfull Login in",
        error:""
    })
})



export default AuthRouter
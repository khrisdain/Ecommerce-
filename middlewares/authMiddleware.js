import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";


export const authMiddleware = asyncHandler( async(req, res, next) => {
    let token;
    if(req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers?.authorization?.split(" ")[1]; //second index of bearer token 
        try{
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                const user = await User.findById(decoded?.id);
                req.user = user; 
                next();
            }
        }catch(error){
            throw new Error("Not Authorized token expired, pls login again")
        }
    }else{
        throw new Error("No token is attached to header")
    }
});

export const isAdmin = asyncHandler( async(req, res, next) => {
    const { email } = req.user;
    console.log(req.user)
    const adminUser = await User.findOne({email});
    if(adminUser?.role !== "admin") {
        throw new Error("Sorry, You are not an Admin!")
    }else{
        next()
    }
})
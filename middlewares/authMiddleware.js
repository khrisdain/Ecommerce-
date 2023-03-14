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
                console.log(decoded)
            }
        }catch(error){
            throw new Error("Not Authorized token expired, pls login again")
        }
    }else{
        throw new Error("No token is attached to header")
    }
})
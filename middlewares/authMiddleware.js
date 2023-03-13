import User from "../models/userModel";
import { Jwt } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import expressAsyncHandler from "express-async-handler";

export const authMiddleware = asyncHandler( async(req, res, next) => {
    let token;
    if(req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers?.authorization?.split(" ")[1];
    }else{
        throw new Error(error)
    }
})
import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDBId } from "../utils/validateMongodbId.js";

export const createBlog = asyncHandler( async(req, res) => {
    try{
        const newBlog = await Blog.create(req.body);
        res.json(newBlog)
    }catch(error){
        throw new Error(error)
    }
})

export const updateBlog = asyncHandler( async(req, res) => {
    const {email} = req.body;
    try{
        const userBlog = await User.find({email})
    }catch(error){
        throw new Error(error)
    }
})
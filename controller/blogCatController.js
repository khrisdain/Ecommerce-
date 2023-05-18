import blogCategory from "../models/blogCatModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDBId } from "../utils/validateMongodbId.js";

export const createBlogCategory = asyncHandler( async(req, res) => {
    try{
        const newBlogCategory = req.body;
        res.json(newBlogCategory);
    }catch(error){
        throw new Error
    }
})
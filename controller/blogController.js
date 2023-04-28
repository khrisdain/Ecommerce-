import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDBId } from "../utils/validateMongodbId.js";

export const createBlog = asyncHandler( async(req, res) => {
    try{
        const newBlog = await Blog.create(req.body);
        res.json({
            status: "success",
            newBlog,
        })
    }catch(error){
        throw new Error(error)
    }
})


export const updateBlog = asyncHandler( async(req, res) => {
    const { id } = req.params;
    try{
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {new: true}) //id, update, option parameter(new true updtas the Blog after implementation)
        res.json(updateBlog);
    }catch(error){
        throw new Error(error)
    }
});

export 
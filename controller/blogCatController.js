import blogCategory from "../models/blogCatModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDBId } from "../utils/validateMongodbId.js";

export const createBlogCategory = asyncHandler( async(req, res) => {
    try{
        const newBlogCategory = await blogCategory.create(req.body)
        res.json({
            status: "success",
            newBlogCategory,
        });
    }catch(error){
        throw new Error(error)
    }
});

export const updateBlogCategory = asyncHandler( async(req, res) => {
    const { id } = req.params;
    validateMongoDBId(id)
    try{
        const updateCategory = await blogCategory.findByIdAndUpdate(
            id, 
            req.body, 
            {new: true}
        )
        res.json(updateCategory)
    }catch(error){
        throw new Error(error)
    }
})


export const deleteBlogCategory = asyncHandler( async(req, res) => {
    const {id} = req.params;
    validateMongoDBId(id)
    try{
        const deleteCategory = await blogCategory.findByIdAndDelete(id)
        res.json(deleteCategory)
    }catch(error){
        throw new Error(error)
    }
})


export const getAllBlogCategory = asyncHandler( async(req, res) => {
    try{
        const getAllCategory = await blogCategory.find()
        res.json(getAllCategory)
    }catch(error){
        throw new Error(error)
    }
})

export const getABlogCategory = asyncHandler( async(req, res) => {
    const { id } = req.params;
    try{
        const getABlog = await blogCategory.findById(id)
        res.json(getABlog)
    }catch(error){
        throw new Error(error)
    }
})
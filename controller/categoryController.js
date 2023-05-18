import Category from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDBId } from "../utils/validateMongodbId.js";


//create new product Category: admin only
export const createCategory = asyncHandler(async(req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory)
    }catch(error){
        throw new Error(error)
    }
});


//update p.c: admin
export const updateCategory = asyncHandler( async(req, res) => {
    const { id } = req.params;
    validateMongoDBId(id)
    try{
        const updateCategory = await Category.findByIdAndUpdate(id, req.body,{new: true}); //id, optiton, change on submission
        res.json(updateCategory)
    }catch(error){
        throw new Error(error)
    }
});

//delete p.c: admin
export const deleteCategory = asyncHandler( async(req, res) => {
    const { id } = req.params
    try{
        const deletedCategory = await Category.findByIdAndDelete(id)
        res.json(deletedCategory)
    }catch(error){
        throw new Error(error)
    }
});


//fetch a category 
export const getCategory = asyncHandler( async(req, res) => {
    const { id } = req.params;
    validateMongoDBId(id)
    try{
        const getCategory = await Category.findById(id);
        res.json(getCategory);
    }catch(error){
        throw new Error(error)
    }
});


//fetch all category
export const getAllCategory= asyncHandler( async(req, res) => {
    try{
        const getAllCategory = await Category.find();
        res.json(getAllCategory)
    }catch(error){
    throw new Error(error)
    }
})
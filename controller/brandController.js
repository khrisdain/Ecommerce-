import Brand from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDBId } from "../utils/validateMongodbId.js";


//create Brand
export const createBrand = asyncHandler(async(req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand)
    }catch(error){
        throw new Error(error)
    }
});


//update p.c: admin
export const updateBrand = asyncHandler( async(req, res) => {
    const { id } = req.params;
    validateMongoDBId(id)
    try{
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body,{new: true}); //id, optiton, change on submission
        res.json(updateBrand)
    }catch(error){
        throw new Error(error)
    }
});

//delete p.c: admin
export const deleteBrand = asyncHandler( async(req, res) => {
    const { id } = req.params
    try{
        const deletedBrand = await Brand.findByIdAndDelete(id)
        res.json(deletedBrand)
    }catch(error){
        throw new Error(error)
    }
});


//fetch a category 
export const getBrand = asyncHandler( async(req, res) => {
    const { id } = req.params;
    validateMongoDBId(id)
    try{
        const getBrand = await Brand.findById(id);
        res.json(getBrand);
    }catch(error){
        throw new Error(error)
    }
});


//fetch all category
export const getAllBrand= asyncHandler( async(req, res) => {
    try{
        const getAllBrand = await Brand.find();
        res.json(getAllBrand)
    }catch(error){
    throw new Error(error)
    }
})
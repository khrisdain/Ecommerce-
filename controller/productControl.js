import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";


//Create a new product
export const createProduct = asyncHandler( async(req, res) => {
    try{
        const newProduct = await Product.create(req.body);
        res.json(newProduct)
    }catch(error){
        throw new Error(error)
    }
})


//Get a product 
export const getAProduct = asyncHandler( async(req, res) => {
    const {id} = req.params;
    console.log(id)
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct)
    }catch(error){
        throw new Error(error)
    }
})
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { validateMongoDBId } from "../utils/validateMongodbId.js";


//Create a new product
export const createProduct = asyncHandler( async(req, res) => {
    try{
        if(req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    }catch(error){
        throw new Error(error)
    }
})


//UPDATE A PRODUCT
export const updateProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDBId(id);
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);        
      }
      const updateProduct = await Product.findOneAndUpdate({_id: id}, req.body, {
        new: true
      });
      res.json(updateProduct);
    } catch (error) {
      throw new Error(error);
    }
});


//DELETE A PRODUCT
export const deleteProduct = asyncHandler( async(req, res) => {
    const {id} = req.params;
    console.log(req.params)
    try{
        const deleteProduct = await Product.findOneAndDelete({_id: id});
        res.json(deleteProduct);
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


//Get all products
export const getAllProducts= asyncHandler( async(req, res) => {
    try{
        //filtering
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach(el => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`) // \b reps matching border

        let query = Product.find(JSON.parse(queryStr)); //access database model
      

       //Sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(",").join("")
            query = query.sort(sortBy)
        }else{
            query = query.sort("-createdAt")
        }
        const product = await query;//matching Query fetched from database
        res.json({product});
    }
    catch(error){
        throw new Error(error)
    }
})
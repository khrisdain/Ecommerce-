import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import slugify from "slugify";
import { validateMongoDBId } from "../utils/validateMongodbId.js";
import { cloudinaryUploadimg } from "../utils/cloudinary.js"; 


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

        //limiting the fields to only one query
        if(req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }else{
           query = query.select('-__v') 
        };

        //pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit)
        
        if(req.query.page) {
            const productCount = await Product.countDocuments() //mongoose countDoc 
            if(skip >= productCount) throw new Error('This page does not exist')
        }

        const product = await query;//matching Query fetched from database
        res.json({product});
    }
    catch(error){
        throw new Error(error)
    }
});


export const addToWishlist = asyncHandler( async(req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try{
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId); //checks for existing similar id
        if(alreadyAdded){
            let user = await User.findByIdAndUpdate( //$pull(mongoDb syntax:eliminates a value from an array set)
                _id,
                {
                    $pull: { wishlist: prodId}              
                },
                {
                    new: true,
                }
            )
            res.json(user);
        }else{
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: prodId}
                },
                {
                    new: true
                }
            );
            res.json(user)
        }
    }catch(error){
        throw new Error(error)
    }
});


//fix bug later 
export const rating = asyncHandler(async(req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    try{
      const product = await Product.findById(prodId);    
      let alreadyRated = product.ratings.find(
        ({userId}) => userId?.postedBy.toString() === _id.toString()
        );
      if(alreadyRated) {
        const updateRating = await Product.updateOne({
            ratings: { $elemMatch: alreadyRated }
        },
        {
            $set: {"ratings.$.star": star, "ratings.$.comment": comment}
        },
        {
            new: true
        },
        );
      }else{
        const rateProducts = await Product.findByIdAndUpdate(
            prodId,
            {
                $push: {
                    ratings: {
                        star: star,
                        comment: comment, 
                        postedBy: _id
                    }
                },
            },
            {
                new: true,
            }
        );
      }
    const getAllRatings = await Product.findById(prodId);
    let totalRatings = getAllRatings.ratings.length; //sets length of array
    let ratingSum = getAllRatings.ratings
    .map((item) => item.star)//gives an array 
    .reduce((prev,curr) => prev + curr, 0); //helps to sum the total array in map
    let actualRating = Math.round(ratingSum / totalRatings);
    const finalRating = await Product.findByIdAndUpdate(
        prodId,
        {
            totalratings: actualRating,
        },
        { new: true }
    )
    res.json(finalRating)
    }catch(error){
        throw new Error(error)
    }    
}); 



export const uploadImages = asyncHandler( async(req, res) => {
    const id = req.params;
    validateMongoDBId(id)

    try{
        const uploader = (path) => cloudinaryUploadimg(path, "images");
        const urls = [];
        const files = req.files; 
        for (const file of files) { //output expected: req.files
            const { path } = files;
            const newPath = await uploader(path);
            urls.push(newPath);
        }
        const findProduct = await Product.findByIdAndUpdate( id, 
            {
                images: urls.map((file) => {
                    return file;
                }),
            },
            {
                new: true,
            });
        res.json(findProduct)
    }
    catch(error){
        throw new Error(error)
    }
})
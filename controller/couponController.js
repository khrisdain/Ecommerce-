import Coupon from "../models/couponModel.js";
import { validateMongoDBId } from "../utils/validateMongodbId.js";
import asyncHandler from "express-async-handler";

export const createCoupon = asyncHandler( async(req, res) => {
    try{
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    }catch(error){
        throw new Error(error)
    }
});


export const getAllCoupons = asyncHandler( async(req, res) => {
    try{
        const totalCoupons = await Coupon.find();
        res.json(totalCoupons)
    }catch(error){
        throw new Error(error)
    }
});


export const updateCoupon = asyncHandler( async(req, res) => {
    const {id} = req.params;
    validateMongoDBId(id);

    try{
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true
            });
            res.json({ updatedCoupon })
    }catch(error){
        throw new Error(error)
    }
})


export const deleteCoupon = asyncHandler( async( req, res) =>{
    const {id} = req.params;
    validateMongoDBId( id )
    try{
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        res.json({ deletedCoupon })
    }
    catch(error){
        throw new Error(error)
    }
})


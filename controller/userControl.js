import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if(!findUser) {
        //create a new user
        const newUser = await User.create(req.body) //Object-relational mapping to database /ODM 
        res.json(newUser)
    }else {
        throw new Error("User already exists")
    }
});


export const loginUserControl = asyncHandler( async (req, res) => {
    //param: email and password
    const { email, password } = req.body;
    console.log(email, password)
});
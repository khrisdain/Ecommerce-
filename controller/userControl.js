import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { generateToken } from "../config/jwtTokens.js"

//CREATE A NEW USER
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


//LOGIN A USER
export const loginUserControl = asyncHandler( async (req, res) => {
    //param: email and password
    const { email, password } = req.body;

    /*Selects User infor for correlation of database info  */
    const findUser = await User.findOne({ email });
    if(findUser && await findUser.isPasswordMatched(password)){
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        })    
    }else{
        throw new Error("Invalid Credential")
    }

});


//GET ALL USERS 
export const getAllUsers = asyncHandler( async (req, res) => {
    try{
      const getUsers = await User.find()
      res.json(getUsers)
    }catch(error){
        throw new Error("error")
    }
});


//GET A SINGLE USER
export const getUser = asyncHandler( async (req, res) => {
    const { id } = req.user;
    try{
        const findUser = await User.findById(id)
        res.json({ findUser });
    }catch(error){
        throw new Error(error)
    }
});


//UPDATE A USER { user modifying information}
export const updatedUser = asyncHandler( async(req, res) => {
    const {_id} = req.user;
    try{
        const updatedUser = await User.findByIdAndUpdate(_id, {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.email,
            }, 
            {
                new: true,
            }
        );
        res.json(updatedUser)
    }
    catch(error){
        throw new Error(error)
    }
});

//DELETE A USER
export const deleteUser = asyncHandler( async(req, res) => {
    const { id } = req.params;
    try{
        const deleteuser = await User.findByIdAndDelete(id);
        res.json({ deleteuser })
    }
    catch(error){
        throw new Error(error)
    }
});


//BLOCK A USER
export const blockUser = asyncHandler( async(req, res) => {
    const { id } = req.params
    try{
        const blockUsr = await User.findByIdAndUpdate(id, {isBlocked: true}, {new: true});
        res.json({ message: "user is blocked"});
    } catch(error){
        throw new Error(error)
    }
})

//UNBLOCK A USER
export const unblockUser = asyncHandler( async(req, res) => {
    const { id } = req.params
    try{
        const unblcokUsr = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        res.json({ message: "User is unblocked "})
        console.log(unblcokUsr)
    } catch(error){
        throw new Error(error)
    }
})


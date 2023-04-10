import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import jwt  from "jsonwebtoken";
import { generateToken } from "../config/jwtTokens.js";
import { validateMongoDBId } from "../utils/validateMongodbId.js";
import { generateRefreshToken } from "../config/refreshToken.js";

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
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken
            },
            {new: true} 
        );
        //assigned req.cookies value 
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
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

//handle Refresh Token
export const handleRefreshToken = asyncHandler( async(req, res) => {
    const cookie = req.cookies; //express objects 
    if(!cookie?.refreshToken) throw new Error("No refresh token in cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user) throw new Error("no refresh token in database or mismatch");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id){
            throw new Error("There is something wrong with refresh token")
        }
        const accessToken = generateToken(user?._id) //instead of using jwt.sign()...
        res.json({accessToken})
    });
    res.json(user)
})

//LOGOUT FUNCTIONALITY
export const logout = asyncHandler( async(req, res) => {
    const cookie = req.cookies  
    if(!cookie?.refreshToken) throw new Error("No referesh token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user){
        res.clearCookie("refreshToken", {
            http: true,
            secure: true,
        });
        return res.sendStatus(204); //forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        http: true,
        secure:true,
    })
    res.sendStatus(204) //forbiddn
});


//UPDATE A USER { user modifying information}
export const updatedUser = asyncHandler( async(req, res) => {
    const {_id} = req.user;
    validateMongoDBId( _id )

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
    const { _id } = req.user;
    validateMongoDBId( _id )

    try{
        const findUser = await User.findById(_id)
        res.json({ findUser });
    }catch(error){
        throw new Error(error)
    }
});



//DELETE A USER
export const deleteUser = asyncHandler( async(req, res) => {
    const { _id } = req.user;
    validateMongoDBId( _id )

    try{
        const deleteuser = await User.findByIdAndDelete(_id);
        res.json({ deleteuser })
    }
    catch(error){
        throw new Error(error)
    }
});


//BLOCK A USER
export const blockUser = asyncHandler( async(req, res) => {
    const { _id } = req.user
    validateMongoDBId( _id )
    
    try{
        const blockUsr = await User.findByIdAndUpdate(_id, {isBlocked: true}, {new: true});
        res.json({ message: "user is blocked"});
    } catch(error){
        throw new Error(error)
    }
})


//UNBLOCK A USER
export const unblockUser = asyncHandler( async(req, res) => {
    const { _id } = req.user
    console.log(req.user)
    validateMongoDBId( _id )

    try{
        const unblcokUsr = await User.findByIdAndUpdate(_id, { isBlocked: false }, { new: true });
        res.json({ message: "User is unblocked" })
        console.log(unblcokUsr)
    } catch(error){
        throw new Error(error)
    }
})

//UPDATE USER PASSWORD
export const updatePassword = asyncHandler( async(req, res) => {
    const { _id } = req.user;
    const { password } = req.body; //parsed from PUT(updatePassword);
    validateMongoDBId(_id);

    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    }else{
        res.json(user)
    }
})


//FORGOT PASSWORD
export const forgotPasswordToken = asyncHandler( async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({email});
    if(!user) throw new Error ("No user found for this email");
    try{
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, please follow this link to reset your password. This link is valid for 10minutes. <a href="http://localhost:3001/api/user/reser-password/${token}"> Click Here </a>`
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot password link",
            htm: resetURL 
        };
        sendEmail(data);
        res.json(token)
    }catch(error){
        throw new Error(error);
    }
});


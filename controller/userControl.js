import crypto from "crypto"
import jwt  from "jsonwebtoken";
import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import { sendEmail }from "./emailController.js"
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
export const loginAdmin = asyncHandler( async (req, res) => {
    //param: email and password
    const { email, password } = req.body;

    /*Selects User infor for correlation of database info  */
    const findAdmin = await User.findOne({ email });
    if(findAdmin.role !== "admin") throw new Error("Not authorized user");
    if(findAdmin && await findAdmin.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findAdmin?._id);
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
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)
        })    
    }else{
        throw new Error("Invalid Credential")
    }

});


//Log in Admin
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


//SAVE A USER ADDRESS
export const saveAddress = asyncHandler( async( req, res, next) => {
    const { _id } = req.user;
    try{
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { address: req?.body?.address },  
            {
                new: true,
            }
        );
        res.json(updatedUser)
    } catch(error){
        throw new Error(error)
    }
})



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
    const { id } = req.params; //specific application of the 'req' properties 
    validateMongoDBId(id)
    try{
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser
        });
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
        const resetURL = `Hi, please follow this link to reset your password. This link is valid for 10minutes. <a href="http://localhost:3001/api/user/reset-password/${token}"> Click Here </a>`
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


//reset a password
export const resetPassword = asyncHandler( async(req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error(" Token Expired, please try again");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save()
    console.log(user)
})



//fetch users wishlist 
export const getWishlist = asyncHandler( async(req, res) => {
    const { _id } = req.user;
    try{
        const findUser = await User.findById(_id).populate("wishlist") //mongoDB populate**
        res.json(findUser)
    } catch(error){
        throw new Error(error)
    }
})


//USERS CART
export const useCart = asyncHandler( async( req, res) => {
    const { cart } = req.body;
    const { _id } = req.user; //populated by authorization middleware
    validateMongoDBId(_id);
    
    try{
        let products = []
        const user = await User.findById(_id)
        //check if user already have product in the cart
        const alreadyExistInCart = await Cart.findOne({ orderby: user._id})
        if(alreadyExistInCart){
            alreadyExistInCart.remove()
        };
        //for each item in the cart and object is created containing listed objects. 
        for( let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.price = cart[i].price;

            let getPrice = await Product.findById(cart[i]._id).select("price").exec(); //select and execute gotten from
            object.price = getPrice.price;
            products.push(object);
        }
        console.log(object)
    } catch(error) {
        throw new Error(error)
    }
})



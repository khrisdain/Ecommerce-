import uniquid from "uniquid";
import crypto from "crypto"
import jwt  from "jsonwebtoken";
import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js"
import Coupon from "../models/couponModel.js";
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
        //for each item in the cart an object is created containing listed objects. 
        for( let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;

            /*Checks Poduct model and find corresponding product Id to get the specific product type and query the product data set 
            to return the "price" field and exec() executes the Product Model i.e handles the promise
            */
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
        }
        //To get total item in cart
        let cartTotal = 0
        for(let i = 0; i < products.length; i++){
            //Multiply the toatl price of goods with the particular item count
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        console.log(cartTotal)
        //assign and save values of cart(products and cartTotal) to Match with the Cart Model's schema
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby:user?._id
        }).save();
        res.json(newCart)
    } catch(error) {
        throw new Error(error)
    }
})


//fetch a users Cart
export const getUserCart = asyncHandler( async(req, res) => {
    const { _id } = req.user;
    console.log(_id)
    validateMongoDBId(_id)

    try{
        //populate allows mongoose to reference documents in another colllection in the database
        //populate allows us to replace the specified paths in a document with other data from other documents
        const cart = await Cart.findOne({ orderby: _id }).populate("products.product")
        res.json(cart)
    }
    catch(error){
        throw new Error(error)
    }
});


export const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDBId(_id);
    try {
      const user = await User.findOne({ _id });
      const cart = await Cart.findOneAndRemove({ orderby: user._id });
      res.json(cart);
    } catch (error) {
      throw new Error(error);
    }
  });



export const applyCoupon = asyncHandler( async( req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    //check validity of coupon from the Coupon DBc
    const validCoupon = await Coupon.findOne({ name: coupon});
    if( validCoupon === null){
        throw new Error("Invalid Coupon")
    }
    const user = await User.findOne({ _id });
    let { cartTotal} = await Cart.findOne({
        orderby: user._id,
    })

    //totalAfterDiscount ==> Cart Schema
    //cartTotal from user checkout/ validCoupon checks for validity and take sub property discount
    //takes total of bracket, divide by 100 and subtract from original cart value
    //toFixed floats to decimal place i.e "100.00" 
    let totalAfterDiscount = (
        cartTotal - 
        ( cartTotal * validCoupon.discount) / 100
        ).toFixed(2);
    await Cart.findOneAndUpdate(
        { orderby: user?._id },
        { totalAfterDiscount},
        { new: true});
    res.json(totalAfterDiscount);
  })



  //Create A User Order
export const createOrder = asyncHandler( async( req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateMongoDBId(_id);

    try{
        //COD enum "cash on delivery thow error"
        if(!COD) throw new Error ("Create cash order failed");
        const user = await User.findOne(_id);
        let userCart = await Cart.findOne({ orderby: user._id });
        let finalAmount = 0;

        if(couponApplied && userCart.totalAfterDiscount){
            finalAmount = userCart.totalAfterDiscount * 100
        }else {
            finalAmount = userCart.cartTotal * 100
        }

        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniquid(), //Id based off MAC address
                method: "COD",
                amount: finalAmount,
                status: "Cash on delivery",
                created: Date.now(),
                currency: "usd",
            },
            orderby: user?._id,
            orderStatus: "Cash on delivery"
        }).save()

        //maps userCart?.products into object:item following structure of updateOne
        let update = userCart.products.map(( item ) => {
            return{
                //updateOne serves as key to each property mapped
                updateOne: {
                    filter: { _id: item.product._id }, //filters with regards to ID
                    update: { $inc: { quantity: -item.count, sold: +item.count} },//$include
                }
            }
        })
        const updated = await Product.bulkWrite(update, {});
        res.json({ message: "success" });
    }catch(error){
        throw new Error(error)
    }    
});


const getOrders = asyncHandler( async(req, res) => {
    const { _id } = req.user;
    validateMongoDBId(_id)

    try{
        const userOrders = await Order.findOne({ orderby: _id})
    }catch(error){
        throw new Error
    }
})









  
 




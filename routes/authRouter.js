import express from "express";
import { 
    createUser, 
    loginUserControl,
    logout, 
    getAllUsers, 
    getUser, 
    deleteUser, 
    updatedUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    useCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus,
 } from "../controller/userControl.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();


//all posts
router.post("/register", createUser);
router.post("/login", loginUserControl);
router.post("/cart", authMiddleware, useCart);
router.post("/admin-login", authMiddleware, isAdmin, loginAdmin)
router.post("/forgot-password-token", forgotPasswordToken)
router.post("/logout", logout);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder)

//all get
router.get("/get-order", authMiddleware, getOrders)
router.get("/all-users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/cart", authMiddleware, getUserCart)
router.get("/:id", authMiddleware, isAdmin, getUser)
router.get("/wishlist", authMiddleware, getWishlist)

//all put
router.put("/update-order/:id", authMiddleware, isAdmin, updateOrderStatus)
router.put("/password", authMiddleware, updatePassword)
router.put("/empty-cart", authMiddleware, emptyCart)
router.put("/edit-user", authMiddleware, updatedUser) 
router.put("/reset-password/:token", resetPassword)
router.put("/save-address", authMiddleware, saveAddress)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

router.delete("/:id", deleteUser)
export default router; 
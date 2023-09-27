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
 } from "../controller/userControl.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes for controllers
router.post("/register", createUser);
router.put("/password", authMiddleware, updatePassword)
router.post("/login", loginUserControl);
router.post("/cart", useCart);
router.post("/admin-login", authMiddleware, isAdmin, loginAdmin)
router.post("/forgot-password-token", forgotPasswordToken)
router.get("/all-users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.post("/logout", logout)
router.get("/:id", authMiddleware, isAdmin, getUser);
router.get("/wishlist", authMiddleware, getWishlist)
router.delete("/:id", deleteUser)
router.put("/edit-user", authMiddleware, updatedUser) 
router.put("/reset-password/:token", resetPassword)
router.put("/save-address", authMiddleware, saveAddress)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

export default router; 
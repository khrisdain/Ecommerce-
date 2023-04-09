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
    forgotPasswordToken
 } from "../controller/userControl.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes for controllers
router.post("/register", createUser);
router.put("/password", authMiddleware, updatePassword)
router.post("/login", loginUserControl);
router.post("/forgot-password-token", forgotPasswordToken)
router.get("/all-users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.post("/logout", logout)
router.get("/:id", authMiddleware, isAdmin, getUser);
router.delete("/:id", deleteUser);
router.put("/edit-user", authMiddleware, updatedUser) 
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

export default router; 
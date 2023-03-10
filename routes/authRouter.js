import express from "express";
import { createUser, loginUserControl, getAllUsers, getUser, deleteUser, updatedUser } from "../controller/userControl.js";

const router = express.Router();

//routes for controllers
router.post("/register", createUser);
router.post("/login", loginUserControl);
router.get("/all-users", getAllUsers);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.put("/:id", updatedUser)

export default router; 
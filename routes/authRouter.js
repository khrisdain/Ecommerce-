import express from "express";
import { createUser, loginUserControl, getAllUsers, getUser }  from "../controller/userControl.js";

const router = express.Router();

//routes for controllers
router.post("/register", createUser);
router.post("/login", loginUserControl);
router.get("/all-users", getAllUsers);
router.get("/:id", getUser);
router.delete("/:id", getUser)

export default router; 
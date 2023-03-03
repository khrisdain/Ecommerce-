import express from "express";
import { createUser, loginUserControl }  from "../controller/userControl.js";

const router = express.Router();

//routes for controllers
router.post("/register", createUser);
router.post("/login", loginUserControl)

export default router; 
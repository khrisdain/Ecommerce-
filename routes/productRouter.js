import express from "express";
import { createProduct } from "../controller/productControl.js";

const router = express.Router()

router.post("/", createProduct)

export default router;